import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Select, MenuItem } from '@mui/material';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import TeamPlayerList from '../../components/TeamPlayerList';
import { formatDate } from '../../utils/dateUtils';
import { fetchPastGames, fetchSignupsForGame } from '../../redux/slices/gameSlice';
import { usePastGameDetails } from '../../hooks/usePastGameDetails';

const PastGamesPage = () => {
  const dispatch = useDispatch();
  const [selectedGameId, setSelectedGameId] = useState('');
  const { pastGames, isLoadingPastGames } = useSelector(state => state.games);
  const { gameDetails, players, isLoadingGameDetails } = useSelector(state => state.signup);

  useEffect(() => {
    dispatch(fetchPastGames());
  }, [dispatch]);

//   useEffect(() => {
//     if (selectedGameId) {
//       dispatch(fetchSignupsForGame(selectedGameId));
//     }
//   }, [selectedGameId, dispatch]);

usePastGameDetails(selectedGameId); // Use the custom hook

  const handleGameSelect = (event) => {
    setSelectedGameId(event.target.value);
  };

  if (isLoadingPastGames || isLoadingGameDetails) {
    return <LoadingState />;
  }

  if (!pastGames || pastGames.length === 0) {
    return <EmptyState message="No past games available." />;
  }

  const lightsPlayers = players.filter(player => player.team === 'LIGHTS');
  const darksPlayers = players.filter(player => player.team === 'DARKS');

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' component='h1' gutterBottom className="page-title">
        View Past Games
      </Typography>
      <Select
        value={selectedGameId}
        onChange={handleGameSelect}
        displayEmpty
        fullWidth
        className="game-select"
      >
        <MenuItem value="" disabled>
          Select a Game
        </MenuItem>
        {pastGames.map(game => (
          <MenuItem key={game.gameId} value={game.gameId}>
            {formatDate(game.date)} - {game.location}
          </MenuItem>
        ))}
      </Select>
      {selectedGameId && gameDetails && (
        <div className="team-lists-container">
          <TeamPlayerList teamName="Lights" players={lightsPlayers} />
          <TeamPlayerList teamName="Darks" players={darksPlayers} />
        </div>
      )}
    </Container>
  );
};

export default PastGamesPage;