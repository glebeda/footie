import React, { useState } from 'react';
import { getNextGameTime } from '../../utils/dateUtils';
import { createGame } from '../../api/gameService';
import './AdminPage.css'
import { TextField, Button, Container, Typography } from '@mui/material';

const AdminPage = () => {
  const [gameDate, setGameDate] = useState(getNextGameTime());
  const [location, setLocation] = useState('Goals Chingford');
  const [maxPlayers, setMaxPlayers] = useState(10);

  const handleCreateGame = async () => {
    const gameData = {
      date: gameDate,
      location: location,
      maxPlayers: maxPlayers,
      status: 'OPEN', // Hardcoded as it should be always OPEN on creation
    };

    try {
      await createGame(gameData);
      alert('Game scheduled successfully');
      // Optionally, redirect or clear form here
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Schedule next game
      </Typography>
      <TextField
        label="Date and Time"
        type="datetime-local"
        value={gameDate}
        onChange={(e) => setGameDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Location"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Max Players"
        type="number"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateGame}
        style={{ marginTop: '20px' }}
      >
        Setup Game
      </Button>
    </Container>
  );
};

export default AdminPage;
