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

  describe('getOpenGameWithSignups', () => {
    it('successfully retrieves an open game with signups and player names', async () => {
      const mockGame = { GameId: 'openGameId', Status: 'OPEN', MaxPlayers: 10, Date: '2024-04-01', Location: 'Local Sports Center' };
      const mockSignUps = [{ PlayerId: 'playerId1', SignUpDate: '2024-02-18' }];
      const mockPlayer = { PlayerId: 'playerId1', Name: 'Mister Trololo' };

      Game.findOpenGame.mockResolvedValue(mockGame);
      SignupService.getSignUpsForGame.mockResolvedValue(mockSignUps);
      PlayerService.getPlayerById.mockResolvedValue(mockPlayer);

      const result = await gameService.getOpenGameWithSignups();

      expect(result.game).toEqual(mockGame);
      expect(result.signUps).toEqual([{ ...mockSignUps[0], PlayerName: mockPlayer.Name }]);
      expect(Game.findOpenGame).toHaveBeenCalled();
      expect(SignupService.getSignUpsForGame).toHaveBeenCalledWith(mockGame.GameId);
      expect(PlayerService.getPlayerById).toHaveBeenCalledWith('playerId1');
    });

    it('throws an error if no open games are found', async () => {
      Game.findOpenGame.mockResolvedValue(null);

      await expect(gameService.getOpenGameWithSignups()).rejects.toThrow('No open games found.');
      expect(Game.findOpenGame).toHaveBeenCalled();
    });

    it('returns the open game with an empty list of sign-ups if no sign-ups are found', async () => {
        Game.findOpenGame.mockResolvedValue({ GameId: 'openGameId', Status: 'OPEN' });
        SignupService.getSignUpsForGame.mockResolvedValue([]);
      
        const result = await gameService.getOpenGameWithSignups();
      
        expect(result.game.Status).toEqual('OPEN');
        expect(result.signUps).toEqual([]);
        expect(Game.findOpenGame).toHaveBeenCalled();
        expect(SignupService.getSignUpsForGame).toHaveBeenCalledWith('openGameId');
      });

      it('returns the open game with all sign-ups and their corresponding player names', async () => {
        const mockGame = { GameId: 'openGameId', Status: 'OPEN' };
        const mockSignUps = [
          { PlayerId: 'player1', SignUpDate: '2024-01-01' },
          { PlayerId: 'player2', SignUpDate: '2024-01-02' }
        ];
        const mockPlayers = [
          { PlayerId: 'player1', Name: 'Dazed' },
          { PlayerId: 'player2', Name: 'Confused' }
        ];
      
        Game.findOpenGame.mockResolvedValue(mockGame);
        SignupService.getSignUpsForGame.mockResolvedValue(mockSignUps);
        PlayerService.getPlayerById.mockImplementation(playerId =>
          Promise.resolve(mockPlayers.find(player => player.PlayerId === playerId))
        );
      
        const result = await gameService.getOpenGameWithSignups();
      
        expect(result.game).toEqual(mockGame);
        expect(result.signUps).toHaveLength(2);
        expect(result.signUps[0].PlayerName).toEqual('Dazed');
        expect(result.signUps[1].PlayerName).toEqual('Confused');
      });

      it('handles errors when fetching player details and marks the player as Unknown', async () => {
        const mockGame = { GameId: 'openGameId', Status: 'OPEN' };
        const mockSignUps = [{ PlayerId: 'player1', SignUpDate: '2024-01-01' }];
      
        Game.findOpenGame.mockResolvedValue(mockGame);
        SignupService.getSignUpsForGame.mockResolvedValue(mockSignUps);
        PlayerService.getPlayerById.mockRejectedValue(new Error('Player not found'));
      
        const result = await gameService.getOpenGameWithSignups();
      
        expect(result.signUps).toHaveLength(1);
        expect(result.signUps[0].PlayerName).toEqual('Unknown');
      });
      
  });
});
