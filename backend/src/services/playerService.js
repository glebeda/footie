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

};

module.exports = PlayerService;
