jest.mock('../../../src/models/signupModel');
jest.mock('../../../src/models/gameModel');
jest.mock('../../../src/services/playerService');

const signupService = require('../../../src/services/signupService');
const signupModel = require('../../../src/models/signupModel');
const gameModel = require('../../../src/models/gameModel');
const playerService = require('../../../src/services/playerService');
const GameStatus = require('../../../src/constants/gameStatus');
const PlayerRole = require('../../../src/constants/playerRole');

describe('signupService - Substitute Handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('promotion of substitute players', () => {
      beforeEach(() => {
        gameModel.getGameById.mockResolvedValue({
          Status: GameStatus.FULL,
          MaxPlayers: 10,
          MaxSubstitutes: 2,
        });
  
        signupModel.getSignUpsForGame.mockResolvedValue([
          ...Array(9).fill().map((_, index) => ({ PlayerId: `main${index + 1}`, Role: PlayerRole.MAIN })),
          { PlayerId: 'Mudryk', Role: PlayerRole.SUBSTITUTE, SignUpDate: '2023-01-01T00:00:00Z' },
          { PlayerId: 'Zinchecnko', Role: PlayerRole.SUBSTITUTE, SignUpDate: '2023-01-02T00:00:00Z' },
        ]);
  
        signupModel.checkSignUpExists.mockResolvedValue(true);
      });
  
      it('promotes a substitute player to main upon cancellation of a main player', async () => {  
    
      // Simulate cancellation of one main player
      await signupService.cancelSignUp('Tuesday Game', 'main8');
  
      expect(signupModel.deleteSignUp).toHaveBeenCalledWith('Tuesday Game', 'main8');
      // Verify that the first substitute player is promoted to main
      expect(signupModel.updateSignUpRole).toHaveBeenCalledWith('Tuesday Game', 'Mudryk', PlayerRole.MAIN);
      // Verify the game status changes to OPEN if there are still substitute slots available
      expect(gameModel.updateGameStatus).toHaveBeenCalledWith('Tuesday Game', GameStatus.OPEN);
      });
    });
  
    describe('handling the last substitute sign-up', () => {
      beforeEach(() => {
        gameModel.getGameById.mockResolvedValueOnce({
          GameId: 'TuesdayGame',
          Status: GameStatus.OPEN,
          MaxPlayers: 10,
          MaxSubstitutes: 2,
        });
  
        signupModel.getSignUpsForGame.mockResolvedValue([
          ...Array(10).fill().map((_, index) => ({ PlayerId: `player${index + 1}`, Role: PlayerRole.MAIN })),
          { PlayerId: 'Mykolenko', Role: PlayerRole.SUBSTITUTE, SignUpDate: new Date().toISOString() },
        ]);
  
        playerService.ensureUniquePlayer.mockResolvedValue({ PlayerId: 'lastSubstitute' });
        signupModel.checkSignUpExists.mockResolvedValue(false);
      });
  
      it('updates game status to FULL upon adding the last substitute', async () => {

      const result = await signupService.addSignUp('TuesdayGame', 'Last Substitute');

      expect(result).toEqual(expect.objectContaining({ Success: true, PlayerId: 'lastSubstitute', Role: PlayerRole.SUBSTITUTE, Message: 'Sign-up successful' }));
      expect(gameModel.updateGameStatus).toHaveBeenCalledWith('TuesdayGame', GameStatus.FULL);

      // Verify the game status is now FULL
      expect(gameModel.getGameById).toHaveBeenLastCalledWith('TuesdayGame');
      });
    });
  });
