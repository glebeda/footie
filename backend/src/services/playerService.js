const playerModel = require('../models/playerModel');

const PlayerService = {
    async ensureUniquePlayer(name) {
        // Check if a player with the given name already exists
        let player = await playerModel.findPlayerByName(name);
        
        if (!player) {
            player = await playerModel.createPlayer({ Name: name });
        }
        
        return player;
    },

    async getPlayerById(playerId) {
        try {
            const player = await playerModel.getPlayerById(playerId);
            if (!player) {
                throw new Error(`Player not found with ID: ${playerId}`);
            }
            return player;
        } catch (error) {
            console.error("Error in PlayerService.getPlayerById:", error);
            throw error; 
        }
    },

};

module.exports = PlayerService;
// test comment