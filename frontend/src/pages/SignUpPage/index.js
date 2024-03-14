import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { TextField, Container, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PrimaryButton from '../../components/PrimaryButton'
import PlayerList from '../../components/PlayerList'
import AlertComponent from '../../components/AlertComponent'
import EmptyState from '../../components/EmptyState'; 
import LoadingState from '../../components/LoadingState'; 
import { useGameDetails } from '../../hooks/useGameDetails'
import { signUpPlayer } from '../../api/signupService'
import { scrollToTop } from '../../utils/scrollUtils'
import { addPlayer } from '../../redux/slices/signupSlice';
import { formatDate } from '../../utils/dateUtils';
import './SignUpPage.css'

const SignUpPage = () => {
  const dispatch = useDispatch();
  const { players, gameDetails, isLoadingGameDetails } = useSelector(state => state.signup);
  const [playerName, setPlayerName] = useState('')
  const [signupOccurred, setSignupOccurred] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  useGameDetails()
  
  const showAlert = (message, severity = 'error') => {
    setAlertInfo({ open: true, message, severity });
    scrollToTop();
  };

  const hideAlert = () => {
    setAlertInfo({ open: false, message: '', severity: 'error' });
  };

  const handleNameChange = event => {
    setPlayerName(event.target.value)
  }

  const handleSignUp = async event => {
    event.preventDefault()
    try {
      const signupDetails = await signUpPlayer({
        gameId: gameDetails.gameId,
        playerName
      })
      setPlayerName('')
      setHighlightedIndex(signupDetails.playerId)
      setSignupOccurred(true);
      const newPlayer = {
        name: playerName,
        playerId: signupDetails.playerId, 
        gameId: gameDetails.gameId,
        paid: false, 
      };
      dispatch(addPlayer(newPlayer));
      hideAlert();
    } catch (error) {
      console.error(error.message);
      showAlert(error.message);
    }
  }

  useEffect(() => {
    if (signupOccurred) {
      setSignupOccurred(false);
    }
  }, [signupOccurred]);

  if (isLoadingGameDetails) {
    return <LoadingState />; 
  }

  if (!gameDetails) {
    return <EmptyState />;
  }

  return (
    <Container maxWidth='sm'>
    <Typography variant='h4' component='h1' gutterBottom className="game-title">
      Join the Next Game
    </Typography>
    <div className="game-info">
      <span>
        <AccessTimeIcon className="game-info-icon" />
        <span className="game-info-text">Date: {formatDate(gameDetails.date)}</span>
      </span>
      <span>
        <LocationOnIcon className="game-info-icon" />
        <span className="game-info-text">{`Location: ${gameDetails.location}`}</span>
      </span>
    </div>
      <AlertComponent
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={hideAlert}
      />
      <form onSubmit={handleSignUp}>
        <TextField
          label='Your Name'
          variant='outlined'
          fullWidth
          value={playerName}
          onChange={handleNameChange}
          margin='normal'
        />
        <PrimaryButton disabled={!playerName.trim()} onClick={handleSignUp}>
          Sign Up
        </PrimaryButton>
      </form>
      <PlayerList
        players={players}
        maxPlayers={gameDetails?.maxPlayers}
        highlightedIndex={highlightedIndex}
        showAlert={showAlert}
        hideAlert={hideAlert}
        signupOccurred={signupOccurred}
      />
    </Container>
  )
}

export default SignUpPage
