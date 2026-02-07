import axios from 'axios'
import { fetchGameWeatherForecast, weatherServiceInternals } from './weatherService'

jest.mock('axios')

describe('weatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('weatherServiceInternals.buildHourlyWindow', () => {
    it('returns a focused window around kickoff time', () => {
      const hourly = {
        time: [
          '2026-02-10T18:00',
          '2026-02-10T19:00',
          '2026-02-10T20:00',
          '2026-02-10T21:00',
          '2026-02-10T22:00',
        ],
        temperature_2m: [7, 8, 9, 8, 7],
        precipitation_probability: [20, 25, 30, 35, 40],
        weather_code: [2, 3, 61, 61, 3],
      }

      const result = weatherServiceInternals.buildHourlyWindow(hourly, '2026-02-10T20:00')

      expect(result).toHaveLength(4)
      expect(result[0]).toMatchObject({
        time: '2026-02-10T18:00',
        temperature: 7,
        precipitationProbability: 20,
      })
      expect(result[2].description).toBe('Light rain')
    })
  })

  describe('weatherServiceInternals.findKickoffIndex', () => {
    it('finds closest hour when direct string match is not present', () => {
      const result = weatherServiceInternals.findKickoffIndex(
        ['2026-02-10T18:00', '2026-02-10T19:00', '2026-02-10T20:00'],
        '2026-02-10T19:30:00.000Z'
      )

      expect(result).toBe(1)
    })
  })

  describe('fetchGameWeatherForecast', () => {
    it('returns summary and hourly window for game kickoff', async () => {
      axios.get
        .mockResolvedValueOnce({
          data: {
            hourly: {
              time: [
                '2026-02-10T18:00',
                '2026-02-10T19:00',
                '2026-02-10T20:00',
                '2026-02-10T21:00',
              ],
              temperature_2m: [7, 8, 9, 8],
              precipitation_probability: [20, 25, 30, 35],
              weather_code: [2, 3, 61, 61],
            },
          },
        })

      const result = await fetchGameWeatherForecast({
        location: 'Goals Chingford',
        gameDate: '2026-02-10T20:00',
      })

      expect(result.locationLabel).toBe('Goals Chingford, London, United Kingdom')
      expect(result.summary).toMatchObject({
        time: '2026-02-10T20:00',
        temperature: 9,
        precipitationProbability: 30,
      })
      expect(result.hourlyWindow).toHaveLength(4)
      expect(axios.get).toHaveBeenCalledTimes(1)
    })

    it('throws a readable error when geocoding has no matches', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { results: [] } })
        .mockResolvedValueOnce({ data: { results: [] } })
        .mockResolvedValueOnce({ data: { results: [] } })

      await expect(
        fetchGameWeatherForecast({
          location: 'Unknown Place',
          gameDate: '2026-02-10T20:00',
        })
      ).rejects.toThrow('Location not found')
    })
  })
})
