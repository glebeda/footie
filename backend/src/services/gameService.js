const Game = require('../models/gameModel')
const GameStatus = require('../constants/gameStatus')

const gameService = {
  async getGameById (gameId) {
    try {
      const game = await Game.getGameById(gameId)
      if (!game) {
        throw new Error(`Game not found with ID: ${gameId}`)
      }
      return game
    } catch (error) {
      console.error(
        `Error in gameService.getGameById for GameId ${gameId}:`,
        error
      )
      throw new Error(`Unable to retrieve game with ID: ${gameId}`)
    }
  },

  async findUpcomingGame () {
    try {
        const game = await Game.findUpcomingGame();
        if (!game) {
          return null;
        }
        return game;
      } catch (error) {
        console.error(`Error in gameService.findUpcomingGame:`, error);
        throw new Error(`Unable to retrieve upcoming game`);
      }
  },

  async updateGameStatus (gameId, status) {
    try {
      const updatedGame = await Game.updateGameStatus(gameId, status)
      return updatedGame
    } catch (error) {
      console.error(`Error updating game status for GameId ${gameId}:`, error)
      throw new Error(`Unable to update game status for GameId ${gameId}`)
    }
  },

  async createGameIfNoUpcomingExists (gameData) {
    try {
      const upcomingGame = await Game.findUpcomingGame()
      if (upcomingGame) {
        throw new Error('An upcoming game already exists')
      }
      const newGame = await Game.createGame(gameData)
      return newGame
    } catch (error) {
      console.error(`Error in gameService.createGameIfNoUpcomingExists:`, error)
      throw error
    }
  },

  async findPastGames() {
    try {
      const pastGames = await Game.getPastGames();
      return pastGames;
    } catch (error) {
      console.error(`Error in gameService.findPastGames:`, error);
      throw new Error('Error fetching past games');
    }
  }

}

module.exports = gameService
