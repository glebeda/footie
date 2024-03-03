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
