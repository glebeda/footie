import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayers, setGameDetails } from '../store/signupSlice';
import axios from '../axios'; 
import { Button, TextField, Container, Typography } from '@mui/material';
import PlayerList from './PlayerList.js'; 

const SignUpPage = () => {
  const dispatch = useDispatch();
  const { players, gameDetails } = useSelector((state) => state.signup);
  const [playerName, setPlayerName] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  // Function to fetch game details and sign-ups
  const fetchGameDetails = () => {
    axios.get('/signups/upcoming')
      .then(response => {
        const { game, signUps } = response.data;
        dispatch(setGameDetails(game));
        dispatch(setPlayers(signUps.map(signUp => ({
          ...signUp,
          name: signUp.PlayerName,
          hasPaid: false // This can be adjusted once we have the payment status
        }))));
      })
      .catch(error => console.error('There was an error fetching the game details:', error));
  };

  useEffect(() => {
    fetchGameDetails();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlightedIndex(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [players.length]);

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleSignUp = (event) => {
    event.preventDefault(); 
    const signUpDetails = {
      gameId: gameDetails.GameId,
      playerName: playerName
    };
    axios.post('/signups', signUpDetails)
      .then(response => {
        console.log('Player signed up successfully', response.data);
        setPlayerName('');
        setHighlightedIndex(players.length);
        fetchGameDetails(); 
      })
      .catch(error => {
        console.error('There was an error signing up the player:', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up for the Upcoming Game
      </Typography>
      {gameDetails && (
        <Typography variant="h6" gutterBottom>
          {`Game Date: ${gameDetails.Date}, Location: ${gameDetails.Location}`}
        </Typography>
      )}
      <form onSubmit={handleSignUp}>
      <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          value={playerName}
          onChange={handleNameChange}
          margin="normal"
        />
        <Button
          type="submit" 
          variant="contained"
          color="primary"
          disabled={!playerName.trim()}
          style={{ marginBottom: '20px' }}
        >
          Sign Up
        </Button>
      </form>
      <PlayerList players={players} maxPlayers={gameDetails?.MaxPlayers} highlightedIndex={highlightedIndex} />
    </Container>
  );
};

export default SignUpPage;
