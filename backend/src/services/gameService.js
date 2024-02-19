const Game = require('../models/gameModel'); 
const SignupService = require('../services/signupService'); 
const PlayerService = require('../services/playerService');

const gameService = {
    async getGameById(gameId) {
        try {
            const game = await Game.getGameById(gameId);
            if (!game) {
                throw new Error(`Game not found with ID: ${gameId}`);
            }
            return game;
        } catch (error) {
            console.error(`Error in gameService.getGameById for GameId ${gameId}:`, error);
            throw new Error(`Unable to retrieve game with ID: ${gameId}`);
        }
    },

    async updateGameStatus(gameId, status) {
        try {
            const updatedGame = await Game.updateGameStatus(gameId, status);
            return updatedGame;
        } catch (error) {
            console.error(`Error updating game status for GameId ${gameId}:`, error);
            throw new Error(`Unable to update game status for GameId ${gameId}`);
        }
    },

    async getUpcomingGameWithSignups() {
        const upcomingGame = await Game.findUpcomingGame();
        if (!upcomingGame) throw new Error('No upcoming games found.');
        const signUps = await SignupService.getSignUpsForGame(upcomingGame.GameId);
    
        // Fetch player details for each sign-up. Consider performance improvement here
        const signUpsWithPlayerNames = await Promise.all(signUps.map(async (signUp) => {
            try {
                const player = await PlayerService.getPlayerById(signUp.PlayerId);
                return {
                    ...signUp,
                    PlayerName: player.Name,
                };
            } catch (error) {
                // Handling the case where player details couldn't be fetched
                return {
                    ...signUp,
                    PlayerName: 'Unknown', // Defaulting to 'Unknown'
                };
            }
        }));

        return {
            game: upcomingGame,
            signUps: signUpsWithPlayerNames
        }
    },
}

module.exports = gameService;
