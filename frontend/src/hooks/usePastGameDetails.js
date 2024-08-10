import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { fetchGameById, fetchSignupsForGame } from '../redux/slices/gameSlice';
import { setGameDetails, setPlayers, setLoadingState } from '../redux/slices/signupSlice';

export const usePastGameDetails = (gameId) => {
  const dispatch = useDispatch();

  const fetchAndSetPastGameDetails = useCallback(async () => {
    if (!gameId) return;
    dispatch(setLoadingState(true)); 
    try {
      const game = await dispatch(fetchGameById(gameId)).unwrap();
      const signUps = await dispatch(fetchSignupsForGame(gameId)).unwrap();

      dispatch(setGameDetails(game));
      dispatch(setPlayers(signUps.map(signUp => ({
        ...signUp,
        name: signUp.playerName, // Ensure PlayerName is capitalized properly
        playerId: signUp.playerId,
        gameId: game.gameId,
        paid: signUp.paid,
        role: signUp.role,
      }))));
    } catch (error) {
      console.error('There was an error fetching the game details:', error);
    } finally {
      dispatch(setLoadingState(false));
    }
  }, [dispatch, gameId]);

  useEffect(() => {
    fetchAndSetPastGameDetails();
  }, [fetchAndSetPastGameDetails]);

  return { fetchAndSetPastGameDetails };
};