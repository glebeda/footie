const express = require('express');
const router = express.Router();
const gameModel = require('../../models/gameModel');

// POST /games - Create a new game
router.post('/', async (req, res) => {
  try {
    const gameData = req.body;
    const newGame = await gameModel.createGame(gameData);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// GET /games/:id - Get a game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await gameModel.getGameById(id);
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
