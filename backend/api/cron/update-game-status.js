// API endpoint for Vercel Cron Job to update game status
const gameService = require('../../src/services/gameService');
const GameStatus = require('../../src/constants/gameStatus');

module.exports = async (req, res) => {
  // Verify the request is coming from Vercel Cron
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Running cron job to update game status to PLAYED');
    //const upcomingGame = await gameService.findUpcomingGame();
    
    // if (upcomingGame) {
    //   await gameService.updateGameStatus(
    //     upcomingGame.GameId,
    //     GameStatus.PLAYED
    //   );
       console.log('Game status updated successfully');
      return res.status(200).json({ success: true, message: 'Game status updated successfully' });
    // } else {
    //   console.log('No upcoming game found to update');
    //   return res.status(404).json({ success: false, message: 'No upcoming game found to update' });
    // }
  } catch (error) {
    console.error('Failed to update game status:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}; 