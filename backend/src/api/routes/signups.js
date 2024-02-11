const express = require('express');
const router = express.Router();
const signupModel = require('../../models/signupModel'); // Adjust the path as necessary

// POST /signups - Create a new sign-up
router.post('/', async (req, res) => {
    const { gameId, playerId } = req.body;
    try {
        const newSignUp = await signupModel.addSignUp(gameId, playerId);
        res.status(201).json(newSignUp);
    } catch (error) {
        console.error("Failed to create sign-up:", error);
        res.status(500).json({ error: error.toString() });
    }
});

// GET /signups/:gameId - Retrieve all sign-ups for a game
router.get('/:gameId', async (req, res) => {
    const { gameId } = req.params;
    try {
        const signUps = await signupModel.getSignUpsForGame(gameId);
        res.json(signUps);
    } catch (error) {
        console.error("Failed to retrieve sign-ups:", error);
        res.status(500).json({ error: error.toString() });
    }
});

// DELETE /signups - Delete a sign-up
router.delete('/', async (req, res) => {
    const { gameId, playerId } = req.body;
    try {
        const result = await signupModel.deleteSignUp(gameId, playerId);
        res.json(result);
    } catch (error) {
        console.error("Failed to delete sign-up:", error);
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
