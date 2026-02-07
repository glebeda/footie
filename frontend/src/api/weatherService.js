import axios from 'axios'

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast'
const TEN_MINUTES_MS = 10 * 60 * 1000
const MAX_FORECAST_DAYS = 16

const weatherCodeMap = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Violent rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with hail',
}

const cache = new Map()
const knownLocations = {
  'goals chingford': {
    latitude: 51.6335,
    longitude: -0.0179,
    label: 'Goals Chingford, London, United Kingdom',
  },
}

const getCacheKey = (location, gameDate) => `${location}|${gameDate}`

const getCachedForecast = (location, gameDate) => {
  const key = getCacheKey(location, gameDate)
  const cached = cache.get(key)
  if (!cached) {
    return null
  }
  if (Date.now() - cached.createdAt > TEN_MINUTES_MS) {
    cache.delete(key)
    return null
  }
  return cached.value
}

const setCachedForecast = (location, gameDate, value) => {
  const key = getCacheKey(location, gameDate)
  cache.set(key, { value, createdAt: Date.now() })
}

const getWeatherDescription = (weatherCode) =>
  weatherCodeMap[weatherCode] || 'Unknown conditions'

const kickoffHourKey = (gameDate) => {
  if (typeof gameDate !== 'string') {
    return ''
  }
  return gameDate.slice(0, 13)
}

const toTimestamp = (dateLike) => {
  const timestamp = new Date(dateLike).getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

const findKickoffIndex = (hourlyTimes, gameDate) => {
  const directHourMatch = kickoffHourKey(gameDate)
  const directIndex = hourlyTimes.findIndex((time) => time.slice(0, 13) === directHourMatch)
  if (directIndex !== -1) {
    return directIndex
  }

  const kickoffTime = toTimestamp(gameDate)
  if (kickoffTime === null) {
    return -1
  }

  let closestIndex = -1
  let smallestDistance = Number.POSITIVE_INFINITY

  hourlyTimes.forEach((time, index) => {
    const hourlyTime = toTimestamp(time)
    if (hourlyTime === null) {
      return
    }
    const distance = Math.abs(hourlyTime - kickoffTime)
    if (distance < smallestDistance) {
      smallestDistance = distance
      closestIndex = index
    }
  })

  const ninetyMinutesMs = 90 * 60 * 1000
  if (smallestDistance > ninetyMinutesMs) {
    return -1
  }

  return closestIndex
}

const buildHourlyWindow = (hourly, gameDate) => {
  const kickoffIndex = findKickoffIndex(hourly.time, gameDate)
  if (kickoffIndex === -1) {
    return []
  }

  const start = Math.max(0, kickoffIndex - 2)
  const end = Math.min(hourly.time.length - 1, kickoffIndex + 1)
  const window = []

  for (let index = start; index <= end; index += 1) {
    window.push({
      time: hourly.time[index],
      temperature: hourly.temperature_2m[index],
      precipitationProbability: hourly.precipitation_probability[index],
      weatherCode: hourly.weather_code[index],
      description: getWeatherDescription(hourly.weather_code[index]),
    })
  }

  return window
}

const buildLocationCandidates = (location) => {
  const candidates = [location]
  const withoutGoalsPrefix = location.replace(/^goals\s+/i, '')
  if (withoutGoalsPrefix && withoutGoalsPrefix !== location) {
    candidates.push(withoutGoalsPrefix)
  }
  const beforeComma = location.split(',')[0].trim()
  if (beforeComma && !candidates.includes(beforeComma)) {
    candidates.push(beforeComma)
  }
  return candidates
}

const resolveLocation = async (location) => {
  const normalizedLocation = location.trim().toLowerCase()
  if (knownLocations[normalizedLocation]) {
    return knownLocations[normalizedLocation]
  }

  const candidates = buildLocationCandidates(location)
  for (const candidate of candidates) {
    const geocodingResponse = await axios.get(GEOCODING_API_URL, {
      params: {
        name: candidate,
        count: 1,
        language: 'en',
        format: 'json',
      },
    })
    const place = geocodingResponse.data?.results?.[0]
    if (place) {
      return {
        latitude: place.latitude,
        longitude: place.longitude,
        label: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
      }
    }
  }

  throw new Error('Location not found')
}

const getForecastDays = (gameDate) => {
  const kickoffTime = toTimestamp(gameDate)
  if (kickoffTime === null) {
    return 7
  }
  const now = Date.now()
  const daysUntilGame = Math.ceil((kickoffTime - now) / (24 * 60 * 60 * 1000))
  if (daysUntilGame <= 1) {
    return 2
  }
  return Math.min(Math.max(daysUntilGame + 1, 2), MAX_FORECAST_DAYS)
}

export const fetchGameWeatherForecast = async ({ location, gameDate }) => {
  if (!location || !gameDate) {
    throw new Error('Location and gameDate are required')
  }

  const cachedForecast = getCachedForecast(location, gameDate)
  if (cachedForecast) {
    return cachedForecast
  }

  const place = await resolveLocation(location)

  const forecastResponse = await axios.get(FORECAST_API_URL, {
    params: {
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: 'auto',
      hourly: 'temperature_2m,precipitation_probability,weather_code',
      forecast_days: getForecastDays(gameDate),
    },
  })

  const hourly = forecastResponse.data?.hourly
  if (!hourly?.time?.length) {
    throw new Error('Forecast unavailable')
  }

  const hourlyWindow = buildHourlyWindow(hourly, gameDate)
  if (!hourlyWindow.length) {
    throw new Error('Forecast unavailable for game time')
  }

  const kickoffForecast = hourlyWindow.find((item) => item.time.slice(0, 13) === kickoffHourKey(gameDate)) || hourlyWindow[0]

  const payload = {
    locationLabel: place.label,
    updatedAt: new Date().toISOString(),
    summary: kickoffForecast,
    hourlyWindow,
  }

  setCachedForecast(location, gameDate, payload)
  return payload
}

export const weatherServiceInternals = {
  buildHourlyWindow,
  findKickoffIndex,
  getWeatherDescription,
  kickoffHourKey,
  getForecastDays,
}
