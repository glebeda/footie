import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removePlayer } from '../../redux/slices/signupSlice';
import { cancelSignUp } from '../../api/signupService';
import './PlayerList.css';
import CancelDialog from '../CancelDialog';
import CancelIcon from '@mui/icons-material/Cancel';
import { Alert } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
} from '@mui/material';

function PlayerList({ players, maxPlayers, highlightedIndex }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleOpenDialog = (player) => {
    setSelectedPlayer(player);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlayer(null);
  };

  const handleCancelSignUp = async () => {
    if (selectedPlayer) {
      try {
        await cancelSignUp(selectedPlayer.gameId, selectedPlayer.playerId);
        console.log('Sign-up canceled successfully');
        handleCloseDialog();
        dispatch(removePlayer({ playerId: selectedPlayer.playerId }));
        setErrorMessage('');
      } catch (error) {
        console.error('Failed to cancel sign-up:', error);
        handleCloseDialog();
        setErrorMessage('Failed to cancel sign-up. Please try again.');
      }
    }
  };

  return (
    <>
    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Paid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, index) => (
            <TableRow
                key={player.name}
                className={index === highlightedIndex ? 'highlighted-row' : ''}  
                >
                {/* ... */}
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell align="right">
                <Checkbox
                  checked={player.hasPaid}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </TableCell>
              <TableCell align="right" className="cancel-icon-cell">
                  <IconButton onClick={() => handleOpenDialog(player)}>
                    <CancelIcon />
                  </IconButton>
                </TableCell>
            </TableRow>
          ))}
          {Array.from({ length: maxPlayers - players.length }, (_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell component="th" scope="row">
                {players.length + index + 1}
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right">
                <Checkbox disabled />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <CancelDialog
        open={openDialog}
        selectedPlayer={selectedPlayer}
        onConfirm={handleCancelSignUp}
        onCancel={handleCloseDialog}
    />
    </>
  );
}

export default PlayerList;
