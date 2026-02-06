import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { removePlayer } from '../../redux/slices/signupSlice'
import { cancelSignUp } from '../../api/signupService'
import PlayerRow from '../PlayerRow'
import './PlayerList.css'
import ConfirmationDialog from '../ConfirmationDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
} from '@mui/material'

function PlayerList ({ players, maxPlayers, maxSubstitutes, isHighlighting, showAlert, hideAlert, signupOccurred }) {
  const lastRowRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [removingPlayerId, setRemovingPlayerId] = useState(null);
  const dispatch = useDispatch();
  const totalSlots = maxPlayers + maxSubstitutes;

  const lightsPlayers = players.filter(player => player.team === 'LIGHTS');
  const darksPlayers = players.filter(player => player.team === 'DARKS');

  const anyPlayersAssigned = lightsPlayers.length > 0 || darksPlayers.length > 0;

  useEffect(() => {
    if (signupOccurred && lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [players.length, signupOccurred]);

  const handleOpenDialog = player => {
    setSelectedPlayer(player)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedPlayer(null)
  }

  const handleCancelSignUp = async () => {
    if (selectedPlayer) {
      try {
        await cancelSignUp(selectedPlayer.gameId, selectedPlayer.playerId)
        console.log('Sign-up canceled successfully')
        setRemovingPlayerId(selectedPlayer.playerId);
        setTimeout(() => {
          dispatch(removePlayer({ playerId: selectedPlayer.playerId }));
          setRemovingPlayerId(null);
        }, 1000); 
        handleCloseDialog();
        hideAlert();
      } catch (error) {
        console.error('Failed to cancel sign-up:', error)
        handleCloseDialog()
        showAlert('Failed to cancel sign-up. Please try again.')
      }
    }
  }

  return (
    <>
      <TableContainer className='player-list-container' component={Paper}>
         {anyPlayersAssigned && (
          <div className="signup-title">
            <Typography variant="h6" component="div">
              All Sign Ups
            </Typography>
          </div>
        )}
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell className='fixed-width'>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Paid</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
           <TableBody>
  {players.map((player, playerIndex) => (
    <PlayerRow
      key={`player-${player.playerId}`}
      player={player}
      ref={playerIndex === players.length - 1 ? lastRowRef : null} 
      index={playerIndex + 1}
      isSubstitute={playerIndex >= maxPlayers}
      handleOpenDialog={handleOpenDialog}
      isHighlighting={isHighlighting === player.playerId ? player.playerId : null}
      isRemoving={removingPlayerId === player.playerId}
      showAlert={showAlert} 
      hideAlert={hideAlert}
    />
  ))}
  {Array.from({ length: totalSlots - players.length }, (_, emptyIndex) => {
    const displayIndex = players.length + emptyIndex + 1; // Calculate the index for empty slots
    const isSubstitute = displayIndex > maxPlayers;
    const rowClass = isSubstitute ? 'substitute-row' : '';

    return (
      <TableRow key={`empty-${displayIndex}`} className={rowClass}>
        <TableCell className='fixed-width' component='th' scope='row'>
          {displayIndex}
        </TableCell>
        <TableCell></TableCell>
        <TableCell align='right'>
          <Checkbox disabled />
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    );
  })}
</TableBody>

        </Table>
      </TableContainer>
      <ConfirmationDialog
        open={openDialog}
        message='Are you sure you want to cancel sign-up?'
        onConfirm={handleCancelSignUp}
        onCancel={handleCloseDialog}
      />
    </>
  )
}

export default PlayerList
