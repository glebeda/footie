import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { TextField, Container, Typography } from '@mui/material'
import PrimaryButton from '../../components/PrimaryButton'
import PlayerList from '../../components/PlayerList'
import AlertComponent from '../../components/AlertComponent'
import { useGameDetails } from '../../hooks/useGameDetails'
import { signUpPlayer } from '../../api/signupService'
import { scrollToTop } from '../../utils/scrollUtils'

const SignUpPage = () => {
  const { players, gameDetails } = useSelector(state => state.signup)
  const [playerName, setPlayerName] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const { fetchAndSetGameDetails } = useGameDetails()

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
      await signUpPlayer({
        gameId: gameDetails.GameId,
        playerName
      })
      setPlayerName('')
      setHighlightedIndex(playerName)
      await fetchAndSetGameDetails()
      hideAlert();
    } catch (error) {
      console.error(error.message);
      showAlert(error.message);
    }
  }

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' component='h1' gutterBottom>
        Sign Up for the Upcoming Game
      </Typography>
      {gameDetails && (
        <Typography variant='h6' gutterBottom>
          {`Game Date: ${gameDetails.Date}, Location: ${gameDetails.Location}`}
        </Typography>
      )}
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
        maxPlayers={gameDetails?.MaxPlayers}
        highlightedIndex={highlightedIndex}
        showAlert={showAlert}
        hideAlert={hideAlert}
      />
    </Container>
  )
}

export default SignUpPage
