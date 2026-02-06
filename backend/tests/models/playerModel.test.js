const mockBatchGet = jest.fn();

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      batchGet: mockBatchGet,
      put: jest.fn(),
      get: jest.fn(),
      query: jest.fn(),
    })),
  },
}));

const playerModel = require('../../src/models/playerModel');

describe('playerModel.getPlayersByIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array for empty input', async () => {
    const players = await playerModel.getPlayersByIds([]);

    expect(players).toEqual([]);
    expect(mockBatchGet).not.toHaveBeenCalled();
  });

  it('chunks batchGet requests to at most 100 keys', async () => {
    const playerIds = Array.from({ length: 105 }, (_, i) => `player-${i + 1}`);

    mockBatchGet
      .mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Responses: {
              Players: Array.from({ length: 100 }, (_, i) => ({
                PlayerId: `player-${i + 1}`,
                Name: `Player ${i + 1}`,
              })),
            },
          }),
      })
      .mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Responses: {
              Players: Array.from({ length: 5 }, (_, i) => ({
                PlayerId: `player-${i + 101}`,
                Name: `Player ${i + 101}`,
              })),
            },
          }),
      });

    const players = await playerModel.getPlayersByIds(playerIds);

    expect(players).toHaveLength(105);
    expect(mockBatchGet).toHaveBeenCalledTimes(2);
    expect(mockBatchGet.mock.calls[0][0].RequestItems.Players.Keys).toHaveLength(100);
    expect(mockBatchGet.mock.calls[1][0].RequestItems.Players.Keys).toHaveLength(5);
  });

  it('retries unprocessed keys returned by DynamoDB', async () => {
    mockBatchGet
      .mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Responses: {
              Players: [{ PlayerId: 'player-1', Name: 'Player 1' }],
            },
            UnprocessedKeys: {
              Players: {
                Keys: [{ PlayerId: 'player-2' }],
              },
            },
          }),
      })
      .mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Responses: {
              Players: [{ PlayerId: 'player-2', Name: 'Player 2' }],
            },
          }),
      });

    const players = await playerModel.getPlayersByIds(['player-1', 'player-2']);

    expect(players).toEqual([
      { PlayerId: 'player-1', Name: 'Player 1' },
      { PlayerId: 'player-2', Name: 'Player 2' },
    ]);
    expect(mockBatchGet).toHaveBeenCalledTimes(2);
    expect(mockBatchGet.mock.calls[1][0].RequestItems.Players.Keys).toEqual([
      { PlayerId: 'player-2' },
    ]);
  });
});
