import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getNextGameTime } from '../../utils/dateUtils/index'
import formatTeamDataForClipboard from '../../utils/stringUtils';
import {
  createGame,
  updateGameStatus
} from '../../api/gameService'
import CancelGameButton from '../../components/CancelGameButton'
import PrimaryButton from '../../components/PrimaryButton'
import LoadingState from '../../components/LoadingState'
import './AdminPage.css'
import { TextField, Typography } from '@mui/material'
import { updateMultiplePlayersTeams } from '../../api/signupService'
import { useGameDetails } from '../../hooks/useGameDetails'
import { setGameNotFound } from '../../redux/slices/signupSlice';
import PlayerListWithTeamSelection from '../../components/PlayerListWithTeamSelection'
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import AlertComponent from '../../components/AlertComponent';

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { players, gameDetails, isLoadingGameDetails } = useSelector(state => state.signup);
  const [gameDate, setGameDate] = useState(getNextGameTime())
  const [location, setLocation] = useState('Goals Chingford')
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [MaxSubstitutes, setMaxSubstitutes] = useState(2)
  const [isCancelling, setIsCancelling] = useState(false)
  const [teamAssignments, setTeamAssignments] = useState({})
  const { fetchAndSetGameDetails } = useGameDetails();
  const [isIPhone, setIsIPhone] = useState(false); 
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

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
      const isIPhoneUser = /iPhone/.test(navigator.userAgent) && !window.MSStream;
      setIsIPhone(isIPhoneUser);
    }
  }, [gameDetails, players]);

  const handleTeamChange = (playerId, team) => {
    setTeamAssignments({
      ...teamAssignments,
      [playerId]: team
    })
  }

  const handleSaveAssignments = async () => {
    const teamAssignmentsArray = players
    .filter((player) => player.role === 'MAIN') // Include only main players
    .map((player) => ({
      playerId: player.playerId,
      team: teamAssignments[player.playerId] || '', // Get the assigned team or empty string if none
    }));
  
    await updateMultiplePlayersTeams(gameDetails.gameId, teamAssignmentsArray);
  };

  const showAlert = (message, severity = 'error') => {
    setAlertInfo({ open: true, message, severity });
  };

  const hideAlert = () => {
    setAlertInfo({ open: false, message: '', severity: 'error' });
  };

  const handleCancelGame = async () => {
    if (gameDetails) {
      setIsCancelling(true);
      try {
        await updateGameStatus(gameDetails.gameId, 'CANCELLED');
        showAlert('Game cancelled successfully', 'success');
        dispatch(setGameNotFound()); 
      } catch (error) {
        showAlert(error.message || 'Failed to cancel game. Please try again.');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const handleOpenCancelConfirmation = () => {
    setIsCancelConfirmationOpen(true);
  };

  const handleCloseCancelConfirmation = () => {
    setIsCancelConfirmationOpen(false);
  };

  const handleConfirmCancelGame = async () => {
    await handleCancelGame();
    handleCloseCancelConfirmation();
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
      showAlert('Game scheduled successfully', 'success');
      await fetchAndSetGameDetails();
    } catch (error) {
      showAlert(error.message || 'Failed to schedule game. Please try again.');
    }
  }

  const handleCopyTeams = async () => {
    const teamData = formatTeamDataForClipboard(players, teamAssignments);
    await navigator.clipboard.writeText(teamData);
  };

  const handleSaveAndCopy = async () => {
    try {
      await handleSaveAssignments();
      if (!isIPhone) {
        await handleCopyTeams();
        showAlert('Teams saved and copied to clipboard', 'success');
      } else {
        showAlert('Teams saved successfully', 'success'); 
      }
      navigate('/'); 
    } catch (error) {
      console.error('Error saving and copying teams:', error);
      showAlert('Failed to save and copy teams. Please try again.');
    }
  };

  const hasPlayers = players && players.some((player) => player.role === 'MAIN');

  const allTeamsAssigned = players
    .filter((player) => player.role === 'MAIN')
    .every((player) => teamAssignments[player.playerId] === 'LIGHTS' || teamAssignments[player.playerId] === 'DARKS');

  return (
    <PageLayout>
      <Typography variant='h4' gutterBottom>
        Schedule next game
      </Typography>
      <AlertComponent
        mode='toast'
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={hideAlert}
      />
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
              onCancelGame={handleOpenCancelConfirmation}
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
            <PrimaryButton
              onClick={handleSaveAndCopy}
              disabled={!allTeamsAssigned}
              color='primary'
              style={{ marginLeft: 'auto'}}>
              {isIPhone ? 'Save Teams' : 'Save and Copy Teams'}
            </PrimaryButton>
          </div>
        </>
      )}
      <ConfirmationDialog
        open={isCancelConfirmationOpen}
        message='Are you sure you want to cancel upcoming game?'
        onConfirm={handleConfirmCancelGame}
        onCancel={handleCloseCancelConfirmation}
      />
    </PageLayout>
  )
}

export default AdminPage
