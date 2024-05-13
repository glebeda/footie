const PlayerService = require('./playerService')
const signupModel = require('../models/signupModel')
const GameService = require('../services/gameService')
const GameStatus = require('../constants/gameStatus')
const PlayerRole = require('../constants/playerRole')
const Team = require('../constants/team')

const signUpService = {
  async addSignUp (gameId, playerName) {
    const gameInfo = await GameService.getGameById(gameId);
    if (gameInfo.Status === GameStatus.FULL) {
      throw new Error('Cannot sign up, the game is already full')
    }

    const player = await PlayerService.ensureUniquePlayer(playerName);
    const playerId = player.PlayerId;

    const existingSignUp = await signupModel.checkSignUpExists(gameId, playerId);
    if (existingSignUp) {
      throw new Error('Player is already signed up for this game');
    }

    const signUps = await signupModel.getSignUpsForGame(gameId);

    let role = PlayerRole.MAIN;
    if (signUps.length >= gameInfo.MaxPlayers) {
      role = PlayerRole.SUBSTITUTE;
    }

    await signupModel.addSignUp(gameId, playerId, role);

    if (signUps.length + 1 === gameInfo.MaxPlayers + gameInfo.MaxSubstitutes) {
      await GameService.updateGameStatus(gameId, GameStatus.FULL);
    }

    return { Success: true, PlayerId: playerId, Role: role, Message: 'Sign-up successful' }
  },

  async cancelSignUp (gameId, playerId) {
    const existingSignUp = await signupModel.checkSignUpExists(gameId, playerId);
    if (!existingSignUp) {
      throw new Error('Sign-up does not exist');
    }

    await signupModel.deleteSignUp(gameId, playerId);

    let signUps = await signupModel.getSignUpsForGame(gameId);
    const gameInfo = await GameService.getGameById(gameId);
    
    if (signUps.filter(s => s.Role === PlayerRole.MAIN).length < gameInfo.MaxPlayers) {
      const earliestSubstitute = signUps
        .filter(s => s.Role === PlayerRole.SUBSTITUTE)
        .sort((a, b) => new Date(a.SignUpDate) - new Date(b.SignUpDate))[0];
      if (earliestSubstitute) {
        await signupModel.updateSignUpRole(gameId, earliestSubstitute.PlayerId, PlayerRole.MAIN);
        signUps = await signupModel.getSignUpsForGame(gameId); // Refresh the sign-ups list after promotion
      }
    }

    if (gameInfo.Status === GameStatus.FULL && signUps.length < gameInfo.MaxPlayers + gameInfo.MaxSubstitutes) {
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
    if (!upcomingGame) {
      return { game: null, signUps: [] };
    }
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
  },

  async updateTeamAssignment(gameId, playerId, team) {
    if (!Object.values(Team).includes(team)) {
      throw new Error(`Invalid team value. Allowed values are ${Object.values(Team).join(', ')}`);
    }

    try {
      const updatedSignUp = await signupModel.updateSignUpTeam(gameId, playerId, team);
      return updatedSignUp;
    } catch (error) {
      console.error('Failed to update team:', error);
      throw error;
    }
  },

  async updateMultipleTeamAssignments(gameId, teamAssignments) {
    try {
      const updatedSignUps = [];

      for (const { playerId, team } of teamAssignments) {
        const updatedSignUp = await this.updateTeamAssignment(gameId, playerId, team);
        updatedSignUps.push(updatedSignUp);
      }

      return updatedSignUps;
    } catch (error) {
      console.error('Error updating multiple team assignments:', error);
      throw new Error('Unable to update multiple team assignments');
    }
  }
}

module.exports = signUpService
