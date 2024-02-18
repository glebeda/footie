import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayers, setHasSignedUp, setHasPaid } from '../store/signupSlice';
import axios from '../axios'; 
import { Button, List, ListItem, ListItemText, TextField, Container, Typography } from '@mui/material';

const SignUpPage = () => {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.signup);
  const [playerName, setPlayerName] = useState('');
  // Temporary for testing
  const gameId = 'e2912220-8dce-4dc8-9881-b04c5bda1fa6';

  // useEffect(() => {
  //   // Fetch the initial list of players
  //   axios.get('/api/players')
  //     .then(response => {
  //       dispatch(setPlayers(response.data));
  //     })
  //     .catch(error => console.error('There was an error fetching the players:', error));
  // }, [dispatch]);

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleSignUp = () => {
    // Construct the sign-up object
       const signUpDetails = {
        gameId: gameId,
        playerName: playerName
      };
    // API call
    axios.post('/signups', signUpDetails)
      .then(response => {
        // Handle the successful sign-up here
        console.log('Player signed up successfully', response.data);
        // Clear the playerName or show a success message
        setPlayerName('');
      })
      .catch(error => {
        // Handle errors here
        console.error('There was an error signing up the player:', error);
        // Show error message
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up for Next Game
      </Typography>
      <TextField
        label="Your Name"
        variant="outlined"
        fullWidth
        value={playerName}
        onChange={handleNameChange}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignUp}
        disabled={!playerName.trim()}
        style={{ marginBottom: '20px' }}
      >
        Sign Up
      </Button>
      {/* <List>
        {players.map((player, index) => (
          <ListItem key={index}>
            <ListItemText primary={player.name} secondary={player.hasPaid ? 'Paid' : 'Not Paid'} />
          </ListItem>
        ))}
      </List> */}
    </Container>
  );
};

export default SignUpPage;
