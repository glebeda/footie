import axios from './axios.js'; 

export const fetchGameDetails = () => {
  return axios.get('/signups/upcoming')
    .then(response => response.data)
    .catch(error => {
      throw new Error('There was an error fetching the game details:', error);
    });
};

export const signUpPlayer = (signUpDetails) => {
  return axios.post('/signups', signUpDetails)
    .then(response => response.data)
    .catch(error => {
      throw new Error('There was an error signing up the player:', error);
    });
};
