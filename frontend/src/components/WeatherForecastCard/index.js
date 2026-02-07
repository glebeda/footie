import React, { useMemo, useRef, useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WaterDropIcon from '@mui/icons-material/WaterDrop'

const formatHour = (isoDateTime) => {
  const date = new Date(isoDateTime)
  if (Number.isNaN(date.getTime())) {
    return isoDateTime
  }
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

const formatDateTime = (isoDateTime) => {
  const date = new Date(isoDateTime)
  if (Number.isNaN(date.getTime())) {
    return isoDateTime
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

const WeatherForecastCard = ({ gameDateLabel, gameLocation, loading, error, forecast }) => {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef(null)

  const title = useMemo(() => {
    if (!gameDateLabel || !gameLocation) {
      return 'Match forecast'
    }
    return `Forecast for ${gameDateLabel} at ${gameLocation}`
  }, [gameDateLabel, gameLocation])

  const handleEntered = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <Accordion
      ref={cardRef}
      disableGutters
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      TransitionProps={{ onEntered: handleEntered }}
      sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} />
              <Typography variant='body2' color='text.secondary'>
                Loading forecast...
              </Typography>
            </Box>
          )}
          {!loading && error && (
            <Typography variant='body2' color='text.secondary'>
              Forecast unavailable right now.
            </Typography>
          )}
          {!loading && !error && forecast?.summary && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WbSunnyIcon fontSize='small' />
                <Typography variant='body2'>{forecast.summary.temperature}°C</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WaterDropIcon fontSize='small' />
                <Typography variant='body2'>{forecast.summary.precipitationProbability}% rain</Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {forecast.summary.description}
              </Typography>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        {!loading && !error && forecast?.hourlyWindow?.length > 0 && (
          <>
            {forecast.hourlyWindow.map((entry, index) => (
              <Box key={entry.time}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant='body2' sx={{ minWidth: 64 }}>
                    {formatHour(entry.time)}
                  </Typography>
                  <Typography variant='body2'>{entry.description}</Typography>
                  <Typography variant='body2'>{entry.temperature}°C</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {entry.precipitationProbability}% rain
                  </Typography>
                </Box>
                {index < forecast.hourlyWindow.length - 1 && <Divider />}
              </Box>
            ))}
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
              Last updated: {formatDateTime(forecast.updatedAt)}
            </Typography>
          </>
        )}
        {!loading && error && (
          <Typography variant='body2' color='text.secondary'>
            We could not load weather data for this game at the moment.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default WeatherForecastCard
