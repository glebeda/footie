const Game = require('../../src/models/gameModel')
const SignupService = require('../../src/services/signupService')
const PlayerService = require('../../src/services/playerService')
const gameService = require('../../src/services/gameService')
const GameStatus = require('../../src/constants/gameStatus');

jest.mock('../../src/models/gameModel')
jest.mock('../../src/services/signupService')
jest.mock('../../src/services/playerService')

describe('gameService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getGameById', () => {
    it('successfully retrieves a game by ID', async () => {
      const mockGame = {
        GameId: 'testGameId',
        Status: 'OPEN',
        MaxPlayers: 10,
        MaxSubstitutes: 2,
        Date: '2024-04-01',
        Location: 'Local Sports Center'
      }
      Game.getGameById.mockResolvedValue(mockGame)

      const result = await gameService.getGameById('testGameId')

      expect(result).toEqual(mockGame)
      expect(Game.getGameById).toHaveBeenCalledWith('testGameId')
    })

    it('throws an error if the game is not found', async () => {
      Game.getGameById.mockResolvedValue(null)

      await expect(
        gameService.getGameById('nonExistentGameId')
      ).rejects.toThrow('Unable to retrieve game with ID: nonExistentGameId')
      expect(Game.getGameById).toHaveBeenCalledWith('nonExistentGameId')
    })
  })

  describe('updateGameStatus', () => {
    it('successfully updates a game status', async () => {
      const updatedGameStatus = { Status: GameStatus.PLAYED }
      Game.updateGameStatus.mockResolvedValue(updatedGameStatus)

      const result = await gameService.updateGameStatus('testGameId', GameStatus.PLAYED)

      expect(result).toEqual(updatedGameStatus)
      expect(Game.updateGameStatus).toHaveBeenCalledWith('testGameId', GameStatus.PLAYED)
    })
  })

  describe('createGameIfNoUpcomingExists', () => {
    it('should not allow creating a new game if an upcoming game exists', async () => {
      const mockGame = {
        GameId: 'upcomingGameId',
        Status: 'OPEN',
        MaxPlayers: 10,
        MaxSubstitutes: 2,
        Date: '2024-05-01',
        Location: 'Local Sports Center'
      }
      Game.findUpcomingGame.mockResolvedValue(mockGame)

      await expect(
        gameService.createGameIfNoUpcomingExists({
          /* gameData */
        })
      ).rejects.toThrow('An upcoming game already exists')

      expect(Game.findUpcomingGame).toHaveBeenCalled()
      expect(Game.createGame).not.toHaveBeenCalled()
    })

    it('should allow creating a new game if no upcoming game exists', async () => {
      Game.findUpcomingGame.mockResolvedValue(null)

      const gameData = {
        Date: '2024-05-08',
        Location: 'Local Sports Center',
        MaxPlayers: 10,
        MaxSubstitutes: 2,
        Status: GameStatus.OPEN
      }
      const mockNewGame = { ...gameData, GameId: 'newGameId' }
      Game.createGame.mockResolvedValue(mockNewGame) 

      const result = await gameService.createGameIfNoUpcomingExists(gameData)

      expect(result).toEqual(mockNewGame)
      expect(Game.findUpcomingGame).toHaveBeenCalled() 
      expect(Game.createGame).toHaveBeenCalledWith(gameData) 
    })
  })

  describe('gameService.findPastGames', () => {
    it('should return past games excluding OPEN and CANCELLED statuses', async () => {
      const mockGames = [
        { gameId: '1', Status: GameStatus.PLAYED, Date: '2023-05-10' },
        { gameId: '4', Status: GameStatus.PLAYED, Date: '2023-05-13' },
      ];
  
      Game.getPastGames.mockResolvedValue(mockGames);
  
      const pastGames = await gameService.findPastGames();
      expect(pastGames).toHaveLength(2);
      expect(pastGames).toEqual(mockGames);
    });
  });
})
