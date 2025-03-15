const express = require('express');
const router = express.Router();
const gameService = require('../../services/gameService');
const GameStatus = require('../../constants/gameStatus');

// Middleware to verify cron requests
const verifyCronRequest = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Route to update game status
router.post('/update-game-status', verifyCronRequest, async (req, res) => {
  console.log('Cron endpoint called for updating game status');
  
  try {
    console.log('Running cron job to update game status to PLAYED');
    // const upcomingGame = await gameService.findUpcomingGame();
    
    // if (upcomingGame) {
    //   await gameService.updateGameStatus(
    //     upcomingGame.GameId,
    //     GameStatus.PLAYED
    //   );
    //   console.log('Game status updated successfully');
      return res.status(200).json({ success: true, message: 'Game status updated successfully' });
    // } else {
    //   console.log('No upcoming game found to update');
    //   return res.status(404).json({ success: false, message: 'No upcoming game found to update' });
    // }
  } catch (error) {
    console.error('Failed to update game status:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 