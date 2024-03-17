// TODO: this needs to be finalized. server.js needs to be adjusted to support API tests
// const request = require('supertest');
// const app = require('../../server');
// const GameService = require('../../src/services/gameService');
// const GameStatus = require('../../src/constants/gameStatus');

// jest.mock('../../src/services/gameService');

// describe('PUT /games/:id/status', () => {
//   const gameId = 'some-game-id';
//   const gameStatus = GameStatus.CANCELLED;
  
//   it('should update the game status to CANCELLED', async () => {
//     GameService.updateGameStatus.mockResolvedValue({
//       // Mocked game object with the updated status
//       id: gameId,
//       status: gameStatus,
//     });
    
//     const response = await request(app)
//       .put(`/games/${gameId}/status`)
//       .send({ status: gameStatus });
    
//     expect(GameService.updateGameStatus).toHaveBeenCalledWith(gameId, gameStatus);
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       message: 'Game status updated successfully',
//       updatedGame: expect.objectContaining({
//         id: gameId,
//         status: gameStatus,
//       }),
//     });
//   });

//   it('should return an error for an invalid game status', async () => {
//     const invalidStatus = 'INVALID_STATUS';
    
//     const response = await request(app)
//       .put(`/games/${gameId}/status`)
//       .send({ status: invalidStatus });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

// });
