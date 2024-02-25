import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayers, setGameDetails } from '../redux/slices/signupSlice';
import { fetchGameDetails } from '../api/signupService';

export const useGameDetails = () => {
  const dispatch = useDispatch();

  const fetchAndSetGameDetails = useCallback(async () => {
    try {
      const { game, signUps } = await fetchGameDetails();
      dispatch(setGameDetails(game));
      dispatch(setPlayers(signUps.map(signUp => ({
        ...signUp,
        name: signUp.PlayerName,
        playerId: signUp.PlayerId,
        gameId: game.GameId,
        hasPaid: signUp.Paid,
      }))));
    } catch (error) {
      console.error('There was an error fetching the game details:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAndSetGameDetails();
  }, [fetchAndSetGameDetails]);

  return { fetchAndSetGameDetails };
};