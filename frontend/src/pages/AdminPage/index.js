import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getNextGameTime } from '../../utils/dateUtils'
import formatTeamDataForClipboard from '../../utils/stringUtils';
import {
  createGame,
  updateGameStatus
} from '../../api/gameService'
import CancelGameButton from '../../components/CancelGameButton'
import PrimaryButton from '../../components/PrimaryButton'
import LoadingState from '../../components/LoadingState'
import './AdminPage.css'
import { TextField, Container, Typography } from '@mui/material'
import { updateMultiplePlayersTeams } from '../../api/signupService'
import { useGameDetails } from '../../hooks/useGameDetails'
import { setGameNotFound } from '../../redux/slices/signupSlice';
import PlayerListWithTeamSelection from '../../components/PlayerListWithTeamSelection'

const AdminPage = () => {
  const dispatch = useDispatch();
  const { players, gameDetails, isLoadingGameDetails } = useSelector(state => state.signup);
  const [gameDate, setGameDate] = useState(getNextGameTime())
  const [location, setLocation] = useState('Goals Chingford')
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [MaxSubstitutes, setMaxSubstitutes] = useState(2)
  const [isCancelling, setIsCancelling] = useState(false)
  const [teamAssignments, setTeamAssignments] = useState({})
  const { fetchAndSetGameDetails } = useGameDetails();

  useGameDetails();

  useEffect(() => {
    if (gameDetails) {
      setGameDate(gameDetails.date);
      setLocation(gameDetails.location);
      setMaxPlayers(gameDetails.maxPlayers);
      setMaxSubstitutes(gameDetails.maxSubstitutes);
      const initialAssignments = {};
      players.forEach(player => {
        initialAssignments[player.playerId] = player.team || ''; // Use an empty string if no team is assigned
      });
      setTeamAssignments(initialAssignments);
    }
  }, [gameDetails, players]);

  const handleTeamChange = (playerId, team) => {
    setTeamAssignments({
      ...teamAssignments,
      [playerId]: team
    })
  }

  const handleSaveAssignments = async () => {
    try {
      // Prepare assignments in the required structure
      const teamAssignmentsArray = players
      .filter((player) => player.role === 'MAIN') // Include only main players
      .map((player) => ({
        playerId: player.playerId,
        team: teamAssignments[player.playerId] || '', // Get the assigned team or empty string if none
      }));
  
      await updateMultiplePlayersTeams(gameDetails.gameId, teamAssignmentsArray);
      alert('Team assignments saved successfully');
    } catch (error) {
      alert(`Failed to save team assignments: ${error.message}`);
    }
  };

  const handleCancelGame = async () => {
    if (gameDetails) {
      setIsCancelling(true);
      try {
        await updateGameStatus(gameDetails.gameId, 'CANCELLED');
        alert('Game cancelled successfully');
        dispatch(setGameNotFound()); 
      } catch (error) {
        alert(error.message);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const handleCreateGame = async () => {
    const gameData = {
      Date: gameDate,
      Location: location,
      MaxPlayers: parseInt(maxPlayers, 10),
      MaxSubstitutes: parseInt(MaxSubstitutes, 10),
      Status: 'OPEN' // Hardcoded as it should be always OPEN on creation
    }

    try {
      await createGame(gameData);
      alert('Game scheduled successfully');
      await fetchAndSetGameDetails();
    } catch (error) {
      alert(error.message);
    }
  }

  const handleCopyTeams = async () => {
    const teamData = formatTeamDataForClipboard(players, teamAssignments);
    try {
      await navigator.clipboard.writeText(teamData);
      alert('Team assignments copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy text to clipboard');
    }
  };

  const hasPlayers = players && players.some((player) => player.role === 'MAIN');

  const allTeamsAssigned = players
    .filter((player) => player.role === 'MAIN')
    .every((player) => teamAssignments[player.playerId] === 'LIGHTS' || teamAssignments[player.playerId] === 'DARKS');

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' gutterBottom>
        Schedule next game
      </Typography>
      <TextField
        label='Date and Time'
        type='datetime-local'
        value={gameDate}
        onChange={e => setGameDate(e.target.value)}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Location'
        type='text'
        value={location}
        onChange={e => setLocation(e.target.value)}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Max Players'
        type='number'
        value={maxPlayers}
        onChange={e => setMaxPlayers(e.target.value)}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Max Substitutes'
        type='number'
        value={MaxSubstitutes}
        onChange={e => setMaxSubstitutes(e.target.value)}
        fullWidth
        margin='normal'
      />
      <div className='button-container'>
        {isLoadingGameDetails ? (
          <LoadingState />
        ) : (
          <>
            <PrimaryButton onClick={handleCreateGame} disabled={!!gameDetails}>
              Setup Game
            </PrimaryButton>
            <CancelGameButton
              onCancelGame={handleCancelGame}
              gameId={gameDetails?.gameId}
              isGameIdAvailable={!!gameDetails}
              isCancelling={isCancelling}
            />
          </>
        )}
      </div>
      {hasPlayers && (
        <>
          <Typography variant='h4' className='team-selection-title'>
            Team Selection
          </Typography>
          <PlayerListWithTeamSelection
            players={players}
            teamAssignments={teamAssignments}
            handleTeamChange={handleTeamChange}
          />
          <div className='button-container team-selection-button-container'>
            <PrimaryButton onClick={handleSaveAssignments} disabled={!allTeamsAssigned}>Save Assignments</PrimaryButton>
            <PrimaryButton
              onClick={handleCopyTeams}
              color='secondary'
              disabled={!allTeamsAssigned}
              style={{ marginLeft: 'auto' }}>
              Copy to Clipboard
            </PrimaryButton>
          </div>
        </>
      )}
    </Container>
  )
}

export default AdminPage
