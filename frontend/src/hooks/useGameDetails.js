import { useDispatch } from 'react-redux';
import { setPlayers, setGameDetails } from '../redux/slices/signupSlice';
import axios from '../api/axios';

export const useGameDetails = () => {
  const dispatch = useDispatch();

  const fetchAndSetGameDetails = async () => {
    try {
      const response = await axios.get('/signups/upcoming');
      const { game, signUps } = response.data;
      dispatch(setGameDetails(game));
      dispatch(setPlayers(signUps.map(signUp => ({
        ...signUp,
        name: signUp.PlayerName,
        hasPaid: false
      }))));
    } catch (error) {
      console.error('There was an error fetching the game details:', error);
    }
  };

  return fetchAndSetGameDetails;
};
