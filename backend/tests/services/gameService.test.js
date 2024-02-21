const Game = require('../../src/models/gameModel');
const SignupService = require('../../src/services/signupService');
const PlayerService = require('../../src/services/playerService');
const gameService = require('../../src/services/gameService');

jest.mock('../../src/models/gameModel');
jest.mock('../../src/services/signupService');
jest.mock('../../src/services/playerService');

describe('gameService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGameById', () => {
    it('successfully retrieves a game by ID', async () => {
      const mockGame = { GameId: 'testGameId', Status: 'OPEN', MaxPlayers: 10, Date: '2024-04-01', Location: 'Local Sports Center' };
      Game.getGameById.mockResolvedValue(mockGame);

      const result = await gameService.getGameById('testGameId');

      expect(result).toEqual(mockGame);
      expect(Game.getGameById).toHaveBeenCalledWith('testGameId');
    });

    it('throws an error if the game is not found', async () => {
      Game.getGameById.mockResolvedValue(null);

      await expect(gameService.getGameById('nonExistentGameId')).rejects.toThrow('Unable to retrieve game with ID: nonExistentGameId');
      expect(Game.getGameById).toHaveBeenCalledWith('nonExistentGameId');
    });
  });

  describe('updateGameStatus', () => {
    it('successfully updates a game status', async () => {
      const updatedGameStatus = { Status: 'PLAYED' };
      Game.updateGameStatus.mockResolvedValue(updatedGameStatus);

      const result = await gameService.updateGameStatus('testGameId', 'PLAYED');

      expect(result).toEqual(updatedGameStatus);
      expect(Game.updateGameStatus).toHaveBeenCalledWith('testGameId', 'PLAYED');
    });
  });

});
