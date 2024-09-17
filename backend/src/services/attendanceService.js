// services/attendanceService.js

const GameService = require('./gameService');
const SignUpService = require('./signupService');
const PlayerService = require('./playerService');
const GameStatus = require('../constants/gameStatus');
const PlayerRole = require('../constants/playerRole'); 

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

      // Step 3: Aggregate attendance counts by PlayerId filtering by Role
      let attendanceMap = this.aggregateAttendance(allSignUps);

      // Step 4: Attach player names to attendance records
      attendanceMap = await this.attachPlayerNames(attendanceMap);

      // Step 5: Convert the map to an array and sort it
      const attendanceArray = this.convertAndSortAttendance(attendanceMap);

      return attendanceArray;
    } catch (error) {
      console.error('Error getting season attendance:', error);
      throw error;
    }
  },

  async getGamesInSeason(seasonStartDate, seasonEndDate) {
    try {
      const games = await GameService.getGamesByDateRange(seasonStartDate, seasonEndDate, GameStatus.PLAYED);
      return games;
    } catch (error) {
      console.error('Error retrieving games for the season:', error);
      throw error;
    }
  },

  async getAllSignUpsForGames(gameIds) {
    try {
      const signUpPromises = gameIds.map((gameId) => SignUpService.getSignUpsForGame(gameId));
      const signUpArrays = await Promise.all(signUpPromises);
      const allSignUps = signUpArrays.flat();
      return allSignUps;
    } catch (error) {
      console.error('Error retrieving sign-ups for games:', error);
      throw error;
    }
  },

  aggregateAttendance(signUps) {
    const attendanceMap = {};
    for (const signUp of signUps) {
      if (signUp.Role === PlayerRole.SUBSTITUTE) {
        continue;
      }
      const { PlayerId } = signUp;
      if (!attendanceMap[PlayerId]) {
        attendanceMap[PlayerId] = {
          playerId: PlayerId,
          attendanceCount: 0,
        };
      }
      attendanceMap[PlayerId].attendanceCount += 1;
    }
    return attendanceMap;
  },

  async attachPlayerNames(attendanceMap) {
    const playerIds = Object.keys(attendanceMap);

    const players = await PlayerService.getPlayersByIds(playerIds);

    players.forEach((player) => {
      if (attendanceMap[player.PlayerId]) {
        attendanceMap[player.PlayerId].playerName = player.Name;
      }
    });

    return attendanceMap;
  },

  convertAndSortAttendance(attendanceMap) {
    const attendanceArray = Object.values(attendanceMap);
    attendanceArray.sort((a, b) => b.attendanceCount - a.attendanceCount);
    return attendanceArray;
  },

};

module.exports = attendanceService;
