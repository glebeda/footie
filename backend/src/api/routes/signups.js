const express = require('express');
const router = express.Router();
const signupModel = require('../../models/signupModel'); 
const signupService = require('../../services/signupService');

// POST /signups - Create a new sign-up
router.post('/', async (req, res) => {
    const { gameId, playerName } = req.body;
    try {
        const newSignUp = await signupService.addSignUp(gameId, playerName);
        res.status(201).json(newSignUp);
    } catch (error) {
        console.error("Sign-up error:", error.message);
        switch (error.message) {
            case 'Player is already signed up for this game':
                return res.status(409).json({ error: error.message });
            case 'Cannot sign up, the game is already full':
                return res.status(403).json({ error: error.message });
            case 'Name parameter is required and must not be empty.':
                return res.status(400).json({ error: error.message });
            default:
                return res.status(500).json({ error: 'Internal server error' });
        }
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
