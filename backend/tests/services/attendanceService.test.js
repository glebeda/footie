const attendanceService = require('../../src/services/attendanceService');
const GameService = require('../../src/services/gameService');
const SignUpService = require('../../src/services/signupService');
const PlayerService = require('../../src/services/playerService');
const GameStatus = require('../../src/constants/gameStatus');
const PlayerRole = require('../../src/constants/playerRole');

jest.mock('../../src/services/gameService');
jest.mock('../../src/services/signupService');
jest.mock('../../src/services/playerService');

describe('attendanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSeasonAttendance', () => {
    it('counts only MAIN role sign-ups in attendance', async () => {
      const seasonStartDate = '2023-08-01';
      const seasonEndDate = '2024-05-31';

      const mockGames = [
        { GameId: 'game1', Date: '2023-09-01', Status: GameStatus.PLAYED },
        { GameId: 'game2', Date: '2023-10-01', Status: GameStatus.PLAYED },
      ];

      const mockSignUps = [
        { GameId: 'game1', PlayerId: 'player1', Role: PlayerRole.MAIN },
        { GameId: 'game1', PlayerId: 'player2', Role: PlayerRole.SUBSTITUTE },
        { GameId: 'game2', PlayerId: 'player1', Role: PlayerRole.MAIN },
        { GameId: 'game2', PlayerId: 'player3', Role: PlayerRole.SUBSTITUTE },
      ];

      const mockPlayers = [
        { PlayerId: 'player1', Name: 'Alice' },
        { PlayerId: 'player2', Name: 'Bob' },
        { PlayerId: 'player3', Name: 'Charlie' },
      ];

      // Mock implementations
      GameService.getGamesByDateRange.mockResolvedValue(mockGames);

      SignUpService.getSignUpsForGame.mockImplementation((gameId) => {
        return Promise.resolve(
          mockSignUps.filter((signUp) => signUp.GameId === gameId)
        );
      });

      PlayerService.getPlayersByIds.mockResolvedValue(mockPlayers);

      const expectedAttendanceData = [
        { playerName: 'Alice', attendanceCount: 2 },
      ];

      const result = await attendanceService.getSeasonAttendance(
        seasonStartDate,
        seasonEndDate
      );

      expect(result).toEqual(expectedAttendanceData);
      expect(GameService.getGamesByDateRange).toHaveBeenCalledWith(
        seasonStartDate,
        seasonEndDate,
        GameStatus.PLAYED
      );
      expect(SignUpService.getSignUpsForGame).toHaveBeenCalledTimes(2);
      expect(PlayerService.getPlayersByIds).toHaveBeenCalledWith(['player1']);
    });

    it('returns an empty array when there are no games', async () => {
      const seasonStartDate = '2023-08-01';
      const seasonEndDate = '2024-05-31';

      GameService.getGamesByDateRange.mockResolvedValue([]);

      const result = await attendanceService.getSeasonAttendance(
        seasonStartDate,
        seasonEndDate
      );

      expect(result).toEqual([]);
      expect(GameService.getGamesByDateRange).toHaveBeenCalledWith(
        seasonStartDate,
        seasonEndDate,
        GameStatus.PLAYED
      );
      expect(SignUpService.getSignUpsForGame).not.toHaveBeenCalled();
      expect(PlayerService.getPlayersByIds).not.toHaveBeenCalled();
    });

    it('handles errors thrown by GameService', async () => {
      const seasonStartDate = '2023-08-01';
      const seasonEndDate = '2024-05-31';

      const error = new Error('Database error');
      GameService.getGamesByDateRange.mockRejectedValue(error);

      await expect(
        attendanceService.getSeasonAttendance(seasonStartDate, seasonEndDate)
      ).rejects.toThrow('Database error');

      expect(GameService.getGamesByDateRange).toHaveBeenCalledWith(
        seasonStartDate,
        seasonEndDate,
        GameStatus.PLAYED
      );
      expect(SignUpService.getSignUpsForGame).not.toHaveBeenCalled();
      expect(PlayerService.getPlayersByIds).not.toHaveBeenCalled();
    });
  });

  describe('aggregateAttendance', () => {
    it('correctly aggregates attendance counts, including name mapping', () => {
      const signUps = [
        { PlayerId: 'player1' },
        { PlayerId: 'player2' },
        { PlayerId: 'player1', Role: PlayerRole.MAIN },
        { PlayerId: 'player3', Role: PlayerRole.SUBSTITUTE },
      ];

      const playerIdToNameMap = {
        player1: 'Alice',
        player2: 'Bob ', // Trailing space
        player3: 'Charlie',
      };

      const nameMapping = {
        'Bob': 'Bob',
        'Bob ': 'Bob',
      };

      const expectedAttendanceMap = {
        'Alice': { playerName: 'Alice', attendanceCount: 2 },
        'Bob': { playerName: 'Bob', attendanceCount: 1 },
      };

      const result = attendanceService.aggregateAttendance(
        signUps,
        playerIdToNameMap,
        nameMapping
      );

      expect(result).toEqual(expectedAttendanceMap);
    });
  });

  describe('convertAndSortAttendance', () => {
    it('converts attendance map to sorted array', () => {
      const attendanceMap = {
        'Alice': { playerName: 'Alice', attendanceCount: 2 },
        'Bob': { playerName: 'Bob', attendanceCount: 1 },
      };

      const expectedAttendanceArray = [
        { playerName: 'Alice', attendanceCount: 2 },
        { playerName: 'Bob', attendanceCount: 1 },
      ];

      const result = attendanceService.convertAndSortAttendance(attendanceMap);

      expect(result).toEqual(expectedAttendanceArray);
    });
  });
});
