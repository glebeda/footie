jest.mock('../../../src/models/signupModel');
jest.mock('../../../src/models/gameModel');
jest.mock('../../../src/services/playerService');

const signupService = require('../../../src/services/signupService');
const signupModel = require('../../../src/models/signupModel');
const GameStatus = require('../../../src/constants/gameStatus');
const Team = require('../../../src/constants/team');

describe('signupService - Team Assignment', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('assigning players to teams', () => {
        beforeEach(() => {
            // Mock response for existing game and sign-up check
            signupModel.updateSignUpTeam.mockResolvedValue({
                PlayerId: 'Yaremchuk',
                GameId: 'PSG',
                Team: 'LIGHTS'
            });
        });

        it('should assign a player to a valid team', async () => {
            const result = await signupService.updateTeamAssignment('PSG', 'Yaremchuk', 'LIGHTS');

            expect(result).toEqual(expect.objectContaining({
                PlayerId: 'Yaremchuk',
                GameId: 'PSG',
                Team: 'LIGHTS'
            }));
            expect(signupModel.updateSignUpTeam).toHaveBeenCalledWith('PSG', 'Yaremchuk', 'LIGHTS');
        });

        it('should throw an error for an invalid team assignment', async () => {
            await expect(signupService.updateTeamAssignment('PSG', 'Yaremchuk', 'Yellow'))
                .rejects.toThrow('Invalid team value. Allowed values are LIGHTS, DARKS');

            expect(signupModel.updateSignUpTeam).not.toHaveBeenCalled();
        });
    });
});
