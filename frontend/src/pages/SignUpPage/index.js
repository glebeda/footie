import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { TextField, Container, Typography } from '@mui/material'
import PrimaryButton from '../../components/PrimaryButton'
import PlayerList from '../../components/PlayerList'
import { useGameDetails } from '../../hooks/useGameDetails'
import { signUpPlayer } from '../../api/signupService'

const SignUpPage = () => {
  const { players, gameDetails } = useSelector(state => state.signup)
  const [playerName, setPlayerName] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const { fetchAndSetGameDetails } = useGameDetails()

  useGameDetails()

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
    } catch (error) {
      console.error(error.message)
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
      />
    </Container>
  )
}

export default SignUpPage
