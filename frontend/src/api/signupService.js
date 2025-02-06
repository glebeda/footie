import axios from './axios.js'; 

export const fetchGameDetails = () => {
  return axios.get('/signups/upcoming')
    .then(response => response.data)
    .catch(error => {
      if (error.response && error.response.status === 404) {
        throw new Error('No upcoming games found');
      } else {
        throw new Error('There was an error fetching the game details:', error);
      }
    });
};

export const signUpPlayer = async (signUpDetails) => {
  try {
    const response = await axios.post('/signups', signUpDetails);
    return response.data; 
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 409:
          throw new Error('Player is already signed up for this game.');
        case 403:
          throw new Error("Can't sign up, the game is already full.");
        case 400:
          throw new Error('Name parameter is required and must not be empty.');
        default:
          throw new Error(data.error || 'Internal server error');
      }
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
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

export const updateMultiplePlayersTeams = (gameId, teamAssignments) => {
  const endpoint = `/signups/${gameId}/teams`;
  return axios.patch(endpoint, { teamAssignments })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating multiple players teams:', error);
      throw error;
    });
};

export const getGameWithSignups = (gameId) => {
  return axios.get(`/signups/game/${gameId}`)
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 404:
            throw new Error('Game not found');
          default:
            throw new Error(data.error || 'Error fetching game details');
        }
      } else {
        throw new Error('Network error. Please try again.');
      }
    });
};