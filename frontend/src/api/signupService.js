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

export const cancelSignUp = (gameId, playerId) => {
  return axios.delete(`/signups/${gameId}/${playerId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error canceling the signup:', error);
      throw error;
    });
};

export const updatePaymentStatus = (gameId, playerId, paid) => {
  const endpoint = `/signups/${gameId}/${playerId}/${paid ? 'pay' : 'unpay'}`;
  return axios.patch(endpoint)
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error updating the payment status:', error);
      throw error;
    });
};