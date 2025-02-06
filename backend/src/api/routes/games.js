const express = require('express')
const router = express.Router()
const gameModel = require('../../models/gameModel')
const GameService = require('../../services/gameService')
const GameStatus = require('../../constants/gameStatus')

// POST /games - Create a new game
router.post('/', async (req, res) => {
  try {
    const gameData = req.body
    const newGame = await GameService.createGameIfNoUpcomingExists(gameData)
    res.status(201).json(newGame)
  } catch (error) {
    if (error.message === 'An upcoming game already exists') {
      res.status(409).json({ error: error.toString() })
    } else {
      res.status(500).json({ error: error.toString() })
    }
  }
})

// GET /games/upcoming - Get the upcoming game
router.get('/upcoming', async (req, res) => {
  try {
    const upcomingGame = await GameService.findUpcomingGame();
    if (upcomingGame) {
      res.json(upcomingGame);
    } else {
      res.status(404).json({ error: 'No upcoming game found' });
    }
  } catch (error) {
    console.error(`Error fetching the upcoming game:`, error);
    res.status(500).json({ error: error.toString() });
  }
});

// GET /games/past - Get past games
router.get('/past', async (req, res) => {
  try {
    const pastGames = await GameService.getPastGames();
    if (!pastGames || pastGames.length === 0) {
      return res.status(404).json({ error: 'Sorry lad, no past games found' });
    }
    res.json(pastGames);
  } catch (error) {
    console.error('Error fetching past games:', error);
    res.status(500).json({ error: 'Error fetching past games' });
  }
});

// GET /games/:id - Get a game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const game = await gameModel.getGameById(id)
    if (game) {
      res.json(game)
    } else {
      res.status(404).json({ error: 'Game not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() })
  }
})

// PUT /games/:id/status - Update the status of a game
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!Object.values(GameStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid game status' });
    }

    const updatedGame = await GameService.updateGameStatus(id, status);
    if (updatedGame) {
      res.json({ message: 'Game status updated successfully', updatedGame });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    console.error(`Error updating game status:`, error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router
