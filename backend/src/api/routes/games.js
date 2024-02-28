const express = require('express')
const router = express.Router()
const gameModel = require('../../models/gameModel')
const GameService = require('../../services/gameService')

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

module.exports = router
