const playerService = require('./playerService');
const signupModel = require('../models/signupModel');
const gameModel = require('../models/gameModel');
const GameStatus = require('../constants/gameStatus');

async function addSignUp(gameId, playerName) {
    
    // Retrieve the current game info to check its status and player limit
    const gameInfo = await gameModel.getGameById(gameId);
    if (gameInfo.Status === GameStatus.FULL) {
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
        await gameModel.updateGameStatus(gameId, GameStatus.FULL);
    }

    return { success: true, message: 'Sign-up successful' };
}

async function cancelSignUp(gameId, playerId) {
    // Check if the sign-up exists
    const existingSignUp = await signupModel.checkSignUpExists(gameId, playerId);
    if (!existingSignUp) {
        throw new Error('Sign-up does not exist');
    }

    await signupModel.deleteSignUp(gameId, playerId);

    // Check if the game's status needs to be updated
    const signUps = await signupModel.getSignUpsForGame(gameId);
    const gameInfo = await gameModel.getGameById(gameId);
    //fixing test
    if (gameInfo.Status === "FULL" && signUps.length < gameInfo.MaxPlayers) {
        await gameModel.updateGameStatus(gameId, GameStatus.OPEN);
    }

    return { gameId, playerId };
}

module.exports = {
    addSignUp,
    cancelSignUp,
};
