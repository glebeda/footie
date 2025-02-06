const GameService = require('./gameService');
const SignUpService = require('./signupService');
const PlayerService = require('./playerService');
const GameStatus = require('../constants/gameStatus');
const PlayerRole = require('../constants/playerRole');
const nameMapping = require('../constants/nameMapping');

const attendanceService = {
  async getSeasonAttendance(seasonStartDate, seasonEndDate) {
    try {
      // Step 1: Get all games within the season with status 'PLAYED'
      const games = await this.getGamesInSeason(seasonStartDate, seasonEndDate);
      const gameIds = games.map((game) => game.GameId);

      if (gameIds.length === 0) {
        return []; // No games in the season
      }

      // Step 2: Get all sign-ups for these games
      const allSignUps = await this.getAllSignUpsForGames(gameIds);

      const signUpsForAttendance = allSignUps.filter(
        (signUp) => signUp.Role !== PlayerRole.SUBSTITUTE
      );

      // Step 3: Get all unique PlayerIds from the sign-ups
      const playerIds = [...new Set(signUpsForAttendance.map((signUp) => signUp.PlayerId))];

      // Step 4: Get player names for these PlayerIds
      const players = await PlayerService.getPlayersByIds(playerIds);

      // Step 5: Create a mapping from PlayerId to playerName
      const playerIdToNameMap = {};
      players.forEach((player) => {
        playerIdToNameMap[player.PlayerId] = player.Name;
      });

      // Step 6: Aggregate attendance counts using canonical names
      const attendanceMap = this.aggregateAttendance(
        allSignUps,
        playerIdToNameMap,
        nameMapping
      );

      // Step 7: Convert the map to an array and sort it
      const attendanceArray = this.convertAndSortAttendance(attendanceMap);

      return attendanceArray;
    } catch (error) {
      console.error('Error getting season attendance:', error);
      throw error;
    }
  },

  async getGamesInSeason(seasonStartDate, seasonEndDate) {
    try {
      // Convert string dates to Date objects
      const startDate = new Date(seasonStartDate);
      const endDate = new Date(seasonEndDate);

      const games = await GameService.getGamesByDateRange(
        startDate,
        endDate,
        GameStatus.PLAYED
      );
      return games;
    } catch (error) {
      console.error('Error retrieving games for the season:', error);
      throw error;
    }
  },

  async getAllSignUpsForGames(gameIds) {
    try {
      const signUpPromises = gameIds.map((gameId) =>
        SignUpService.getSignUpsForGame(gameId)
      );
      const signUpArrays = await Promise.all(signUpPromises);
      const allSignUps = signUpArrays.flat();
      return allSignUps;
    } catch (error) {
      console.error('Error retrieving sign-ups for games:', error);
      throw error;
    }
  },

  aggregateAttendance(signUps, playerIdToNameMap, nameMapping) {
    const attendanceMap = {};

    for (const signUp of signUps) {
      if (signUp.Role === PlayerRole.SUBSTITUTE) {
        continue;
      }
      const { PlayerId } = signUp;
      let playerName = playerIdToNameMap[PlayerId];

      // Trim the player name to remove leading/trailing spaces
      playerName = playerName.trim();

      // Map the player name to a canonical name
      const canonicalName = nameMapping[playerName] || playerName;

      if (!attendanceMap[canonicalName]) {
        attendanceMap[canonicalName] = {
          playerName: canonicalName,
          attendanceCount: 0,
        };
      }
      attendanceMap[canonicalName].attendanceCount += 1;
    }

    return attendanceMap;
  },

  convertAndSortAttendance(attendanceMap) {
    const attendanceArray = Object.values(attendanceMap);

    attendanceArray.sort((a, b) => b.attendanceCount - a.attendanceCount);

    return attendanceArray;
  },
};

module.exports = attendanceService;
