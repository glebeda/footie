const express = require('express');
const router = express.Router();
const signupModel = require('../../models/signupModel'); 
const signupService = require('../../services/signupService');

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

router.get('/upcoming', async (req, res) => {
    try {
        const data = await signupService.getUpcomingGameWithSignups();
        res.json(data);
    } catch (error) {
        if (error.message === 'No upcoming games found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

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

router.delete('/:gameId/:playerId', async (req, res) => {
    const { gameId, playerId } = req.params;
    try {
        const result = await signupService.cancelSignUp(gameId, playerId);
        res.status(200).json({ message: 'Sign-up canceled successfully', ...result });
    } catch (error) {
        console.error("Cancel sign-up error:", error.message);
        if (error.message === 'Sign-up does not exist') {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;
