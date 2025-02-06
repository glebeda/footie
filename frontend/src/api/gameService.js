import axios from './axios.js';

export const createGame = (gameData) => {
  return axios.post('/games', gameData)
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 409:
            throw new Error('An upcoming game already exists.');
          default:
            throw new Error(data.error || 'Internal server error');
        }
      } else {
        throw new Error('Network error. Please try again.');
      }
    });
};

export const updateGameStatus = (gameId, status) => {
  return axios.put(`/games/${gameId}/status`, { status })
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            throw new Error('Invalid game status.');
          case 404:
            throw new Error('Game not found.');
          default:
            throw new Error(data.error || 'Error updating game status.');
        }
      } else {
        throw new Error('Network error. Please try again.');
      }
    });
};

export const getUpcomingGame = () => {
  return axios.get('/games/upcoming')
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 404:
            return null;
          default:
            throw new Error(data.error || 'Error fetching the upcoming game.');
        }
      } else {
        throw new Error('Network error. Please try again.');
      }
    });
};

export const getPastGames = () => {
  return axios.get('/games/past')
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 404:
            return [];
          default:
            throw new Error(data.error || 'Error fetching past games');
        }
      } else {
        throw new Error('Network error. Please try again.');
      }
    });
};
