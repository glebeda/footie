const playerService = require('../../src/services/playerService');
const playerModel = require('../../src/models/playerModel');

jest.mock('../../src/models/playerModel');

describe('ensureUniquePlayer', () => {
    beforeEach(() => {
        jest.clearAllMocks()
      })
      
    it('returns an existing player when one with the specified name exists', async () => {
        const mockPlayer = { PlayerId: 'player1', Name: 'Bruno' };
        playerModel.findPlayerByName.mockResolvedValue(mockPlayer);

        const result = await playerService.ensureUniquePlayer('Bruno');

        expect(result).toEqual(mockPlayer);
        expect(playerModel.findPlayerByName).toHaveBeenCalledWith('Bruno');
        expect(playerModel.createPlayer).not.toHaveBeenCalled();
    });

    it('creates and returns a new player when no existing player matches the provided name', async () => {
        playerModel.findPlayerByName.mockResolvedValue(null);
        const newPlayer = { PlayerId: 'player1', Name: 'Alfred' };
        playerModel.createPlayer.mockResolvedValue(newPlayer);
    
        const result = await playerService.ensureUniquePlayer('Alfred');
    
        expect(result).toEqual(newPlayer);
        expect(playerModel.findPlayerByName).toHaveBeenCalledWith('Alfred');
        expect(playerModel.createPlayer).toHaveBeenCalledWith({ Name: 'Alfred' });
    });
    
});
