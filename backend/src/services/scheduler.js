const cron = require('node-cron')
const gameService = require('./gameService')
const GameStatus = require('../constants/gameStatus')

/**
 * Schedules a cron job to update game status to PLAYED
 * NOTE: This is only used for local development.
 * In production (Vercel), this is handled by Vercel Cron Jobs
 * configured in vercel.json and implemented in /api/cron/update-game-status.js
 */
const scheduleGameStatusUpdate = () => {
  // Only run in development environment
  if (process.env.NODE_ENV === 'production') {
    console.log('Scheduler not started in production. Using Vercel Cron Jobs instead.');
    return;
  }

  console.log('Starting scheduler in development environment');
  
  // Schedule task to run every Tuesday at 23:30
  cron.schedule(
    '30 23 * * 2',
    async () => {
      console.log('Running task to update game status to PLAYED')
      try {
        const upcomingGame = await gameService.findUpcomingGame()
        if (upcomingGame) {
          await gameService.updateGameStatus(
            upcomingGame.GameId,
            GameStatus.PLAYED
          ) 
          console.log('Game status updated successfully')
        } else {
            throw new Error('No upcoming game found to update');
        }
      } catch (error) {
        console.error('Failed to update game status:', error)
      }
    },
    {
      scheduled: true,
      timezone: 'Europe/London'
    }
  )
}

module.exports = { scheduleGameStatusUpdate }
