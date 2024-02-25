const PlayerService = require('./playerService')
const signupModel = require('../models/signupModel')
const GameService = require('../services/gameService')
const GameStatus = require('../constants/gameStatus')

const signUpService = {
  async addSignUp (gameId, playerName) {
    const gameInfo = await GameService.getGameById(gameId)
    if (gameInfo.Status === GameStatus.FULL) {
      throw new Error('Cannot sign up, the game is already full')
    }

    const player = await PlayerService.ensureUniquePlayer(playerName)
    const playerId = player.PlayerId

    const existingSignUp = await signupModel.checkSignUpExists(gameId, playerId)
    if (existingSignUp) {
      throw new Error('Player is already signed up for this game')
    }

    await signupModel.addSignUp(gameId, playerId)

    const signUps = await signupModel.getSignUpsForGame(gameId)
    if (signUps.length >= gameInfo.MaxPlayers) {
      await GameService.updateGameStatus(gameId, GameStatus.FULL)
    }

    return { success: true, message: 'Sign-up successful' }
  },

  async cancelSignUp (gameId, playerId) {
    const existingSignUp = await signupModel.checkSignUpExists(gameId, playerId)
    if (!existingSignUp) {
      throw new Error('Sign-up does not exist')
    }

    await signupModel.deleteSignUp(gameId, playerId)

    const signUps = await signupModel.getSignUpsForGame(gameId)
    const gameInfo = await GameService.getGameById(gameId)
    if (gameInfo.Status === 'FULL' && signUps.length < gameInfo.MaxPlayers) {
      await GameService.updateGameStatus(gameId, GameStatus.OPEN)
    }

    return { gameId, playerId }
  },

  async getSignUpsForGame (gameId) {
    try {
      const signUps = await signupModel.getSignUpsForGame(gameId)
      return signUps
    } catch (error) {
      console.error('Error retrieving sign-ups for game:', error)
      throw error
    }
  },

  async getUpcomingGameWithSignups () {
    const upcomingGame = await GameService.findUpcomingGame()
    if (!upcomingGame) throw new Error('No upcoming games found.')
    const signUps = await this.getSignUpsForGame(upcomingGame.GameId)

    // Fetch player details for each sign-up. Consider performance improvement here
    const signUpsWithPlayerNames = await Promise.all(
      signUps.map(async signUp => {
        try {
          const player = await PlayerService.getPlayerById(signUp.PlayerId)
          return {
            ...signUp,
            PlayerName: player.Name
          }
        } catch (error) {
          // Handling the case where player details couldn't be fetched
          return {
            ...signUp,
            PlayerName: 'Unknown' // Defaulting to 'Unknown'
          }
        }
      })
    )

    return {
      game: upcomingGame,
      signUps: signUpsWithPlayerNames
    }
  },

  async updateSignUpPaymentStatus (gameId, playerId, paid) {
    try {
      const updatedSignUp = await signupModel.updatePaymentStatus(
        gameId,
        playerId,
        paid
      )
      return updatedSignUp
    } catch (error) {
      console.error('Error updating payment status for the game:', error)
      throw error
    }
  }
}

module.exports = signUpService
