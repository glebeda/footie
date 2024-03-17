import React, { useState, useEffect } from 'react'
import { getNextGameTime } from '../../utils/dateUtils'
import {
  createGame,
  updateGameStatus,
  getUpcomingGame
} from '../../api/gameService'
import CancelGameButton from '../../components/CancelGameButton'
import PrimaryButton from '../../components/PrimaryButton'
import LoadingState from '../../components/LoadingState';
import './AdminPage.css'
import { TextField, Container, Typography } from '@mui/material'

const AdminPage = () => {
  const [gameDate, setGameDate] = useState(getNextGameTime());
  const [location, setLocation] = useState('Goals Chingford');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [isCancelling, setIsCancelling] = useState(false);
  const [upcomingGame, setUpcomingGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingGame = async () => {
      setIsLoading(true);
      try {
        const game = await getUpcomingGame()
        setUpcomingGame(game)
      } catch (error) {
        console.error('Failed to fetch upcoming game:', error)
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpcomingGame()
  }, [])

  const handleCancelGame = async () => {
    if (upcomingGame) {
      setIsCancelling(true)
      try {
        await updateGameStatus(upcomingGame.gameId, 'CANCELLED')
        alert('Game cancelled successfully')
        setUpcomingGame(null)
      } catch (error) {
        alert(error.message)
      } finally {
        setIsCancelling(false)
      }
    }
  }

  const handleCreateGame = async () => {
    const gameData = {
      Date: gameDate,
      Location: location,
      MaxPlayers: maxPlayers,
      Status: 'OPEN' // Hardcoded as it should be always OPEN on creation
    }

    try {
      await createGame(gameData)
      alert('Game scheduled successfully')
      const game = await getUpcomingGame()
      setUpcomingGame(game)
    } catch (error) {
      alert(error.message)
    }
  }

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
      <div className='button-container'>
        {isLoading ? (
          <LoadingState /> 
        ) : (
          <>
            <PrimaryButton
              onClick={handleCreateGame}
              disabled={!!upcomingGame} 
            >
              Setup Game
            </PrimaryButton>
            <CancelGameButton
              onCancelGame={handleCancelGame}
              gameId={upcomingGame?.gameId}
              isGameIdAvailable={!!upcomingGame}
              isCancelling={isCancelling}
            />
          </>
        )}
      </div>
    </Container>
  )
}

export default AdminPage
