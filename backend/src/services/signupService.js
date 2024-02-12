const playerService = require('./playerService');
const signupModel = require('../models/signupModel');
const gameModel = require('../models/gameModel');

async function addSignUp(gameId, playerName) {
    
    // Retrieve the current game info to check its status and player limit
    const gameInfo = await gameModel.getGameById(gameId);
    if (gameInfo.Status === "FULL") {
        throw new Error('Cannot sign up, the game is already full');
    }    
    
    // Create player if it doesn't exist
    const player = await playerService.ensureUniquePlayer(playerName);
    const playerId = player.PlayerId;
    
    // Check if the sign-up already exists to prevent duplicates
    const existingSignUp = await signupModel.checkSignUpExists(gameId, playerId);
    if (existingSignUp) {
        throw new Error('Player is already signed up for this game');
    }

    // Proceed to add a new sign-up
    await signupModel.addSignUp(gameId, playerId);

    // After adding the sign-up, evaluate if the game should be updated to "FULL"
    const signUps = await signupModel.getSignUpsForGame(gameId);

    if (signUps.length >= gameInfo.MaxPlayers) {
        await gameModel.updateGameStatus(gameId, "FULL");
    }

    return { success: true, message: 'Sign-up successful' };
}

module.exports = {
    addSignUp,
};
