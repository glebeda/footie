import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayers, setGameDetails, setGameNotFound, setLoadingState } from '../redux/slices/signupSlice';
import { fetchGameDetails } from '../api/signupService';

export const useGameDetails = () => {
  const dispatch = useDispatch();

  const fetchAndSetGameDetails = useCallback(async () => {
    dispatch(setLoadingState(true)); 
    try {
      const { game, signUps } = await fetchGameDetails();
      dispatch(setGameDetails(game));
      dispatch(setPlayers(signUps.map(signUp => ({
        ...signUp,
        name: signUp.playerName,
        playerId: signUp.playerId,
        gameId: game.gameId,
        paid: signUp.paid,
      }))));
    } catch (error) {
      if (error.message === 'No upcoming games found') {
        dispatch(setGameNotFound());
      } else {
        console.error('There was an error fetching the game details:', error);
      }
    } finally {
      dispatch(setLoadingState(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAndSetGameDetails();
  }, [fetchAndSetGameDetails]);

  return { fetchAndSetGameDetails };
};