const signupService = require('../../src/services/signupService');
const signupModel = require('../../src/models/signupModel');
const gameService = require('../../src/services/gameService');
const playerService = require('../../src/services/playerService');

jest.mock('../../src/models/signupModel');
jest.mock('../../src/services/gameService');
jest.mock('../../src/services/playerService');


describe('signupServiceGetUpcoming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

      describe('getUpcomingGameWithSignups', () => {
  
        it('successfully retrieves an upcoming OPEN game with signups and player names', async () => {
        const mockGame = { GameId: 'openGameId', Status: 'OPEN', MaxPlayers: 10, Date: '2024-04-01', Location: 'Local Sports Center' };
        const mockSignUps = [{ PlayerId: 'playerId1', SignUpDate: '2024-02-18' }];
        const mockPlayer = { PlayerId: 'playerId1', Name: 'Mister Trololo' };

        gameService.findUpcomingGame.mockResolvedValue(mockGame);
        signupModel.getSignUpsForGame.mockResolvedValue(mockSignUps);
        playerService.getPlayerById.mockResolvedValue(mockPlayer);

        const result = await signupService.getUpcomingGameWithSignups();

        expect(result.game).toEqual(mockGame);
        expect(result.signUps).toEqual([{ ...mockSignUps[0], PlayerName: mockPlayer.Name }]);
        expect(gameService.findUpcomingGame).toHaveBeenCalled();
        expect(signupModel.getSignUpsForGame).toHaveBeenCalledWith(mockGame.GameId);
        expect(playerService.getPlayerById).toHaveBeenCalledWith('playerId1');
      });

    it('successfully retrieves an upcoming FULL game with signups and player names', async () => {
        const mockGame = { GameId: 'openGameId', Status: 'FULL', MaxPlayers: 10, Date: '2024-05-15', Location: 'Chingford Goals Pitch' };
        const mockSignUps = [{ PlayerId: 'playerId1', SignUpDate: '2024-02-18' }];
        const mockPlayer = { PlayerId: 'playerId1', Name: 'Vinnie Jones' };
  
        gameService.findUpcomingGame.mockResolvedValue(mockGame);
        signupModel.getSignUpsForGame.mockResolvedValue(mockSignUps);
        playerService.getPlayerById.mockResolvedValue(mockPlayer);
  
        const result = await signupService.getUpcomingGameWithSignups();
  
        expect(result.game).toEqual(mockGame);
        expect(result.signUps).toEqual([{ ...mockSignUps[0], PlayerName: mockPlayer.Name }]);
        expect(gameService.findUpcomingGame).toHaveBeenCalled();
        expect(signupModel.getSignUpsForGame).toHaveBeenCalledWith(mockGame.GameId);
        expect(playerService.getPlayerById).toHaveBeenCalledWith('playerId1');
      });

    it('handles the case when no upcoming games are found gracefully', async () => {
      gameService.findUpcomingGame.mockResolvedValue(null);

      const result = await signupService.getUpcomingGameWithSignups();
    
      expect(result).toEqual({"game": null, "signUps": []});
      expect(gameService.findUpcomingGame).toHaveBeenCalled();
    });

    it('returns the upcoming game with an empty list of sign-ups if no sign-ups are found', async () => {
        gameService.findUpcomingGame.mockResolvedValue({ GameId: 'openGameId', Status: 'OPEN' });
        signupModel.getSignUpsForGame.mockResolvedValue([]);
      
        const result = await signupService.getUpcomingGameWithSignups();
      
        expect(result.game.Status).toEqual('OPEN');
        expect(result.signUps).toEqual([]);
        expect(gameService.findUpcomingGame).toHaveBeenCalled();
        expect(signupModel.getSignUpsForGame).toHaveBeenCalledWith('openGameId');
      });

      it('returns the upcoming game with all sign-ups and their corresponding player names', async () => {
        const mockGame = { GameId: 'openGameId', Status: 'OPEN' };
        const mockSignUps = [
          { PlayerId: 'player1', SignUpDate: '2024-01-01' },
          { PlayerId: 'player2', SignUpDate: '2024-01-02' }
        ];
        const mockPlayers = [
          { PlayerId: 'player1', Name: 'Dazed' },
          { PlayerId: 'player2', Name: 'Confused' }
        ];
      
        gameService.findUpcomingGame.mockResolvedValue(mockGame);
        signupModel.getSignUpsForGame.mockResolvedValue(mockSignUps);
        playerService.getPlayerById.mockImplementation(playerId =>
          Promise.resolve(mockPlayers.find(player => player.PlayerId === playerId))
        );
      
        const result = await signupService.getUpcomingGameWithSignups();
      
        expect(result.game).toEqual(mockGame);
        expect(result.signUps).toHaveLength(2);
        expect(result.signUps[0].PlayerName).toEqual('Dazed');
        expect(result.signUps[1].PlayerName).toEqual('Confused');
      });

      it('handles errors when fetching player details and marks the player as Unknown', async () => {
        const mockGame = { GameId: 'openGameId', Status: 'OPEN' };
        const mockSignUps = [{ PlayerId: 'player1', SignUpDate: '2024-01-01' }];
      
        gameService.findUpcomingGame.mockResolvedValue(mockGame);
        signupModel.getSignUpsForGame.mockResolvedValue(mockSignUps);
        playerService.getPlayerById.mockRejectedValue(new Error('Player not found'));
      
        const result = await signupService.getUpcomingGameWithSignups();
      
        expect(result.signUps).toHaveLength(1);
        expect(result.signUps[0].PlayerName).toEqual('Unknown');
      });
      
  });
});