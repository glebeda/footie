const Game = require('../models/gameModel'); 

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

    async findUpcomingGame() {
        try {
            const game = await Game.findUpcomingGame();
            if (!game) {
                throw new Error(`No upcoming games found`);
            }
            return game;
        } catch (error) {
            console.error(`Error in gameService.findUpcomingGame:`, error);
            throw new Error(`Unable to retrieve upcoming game`);
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
}

module.exports = gameService;
