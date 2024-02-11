const express = require('express');
const router = express.Router();
const playerModel = require('../../models/playerModel');

// POST /players - Create a new player
router.post('/', async (req, res) => {
    try {
        const playerData = req.body;
        const newPlayer = await playerModel.createPlayer(playerData);
        res.status(201).json(newPlayer);
    } catch (error) {
        console.error("Failed to create player:", error);
        res.status(500).json({ error: error.toString() });
    }
});

// GET /players/:id - Retrieve a player by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const player = await playerModel.getPlayerById(id);
        if (player) {
            res.json(player);
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (error) {
        console.error("Failed to retrieve player:", error);
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
