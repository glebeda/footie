import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removePlayer } from '../../redux/slices/signupSlice'
import { cancelSignUp } from '../../api/signupService'
import PlayerRow from '../PlayerRow'
import './PlayerList.css'
import CancelDialog from '../CancelDialog'
import { Alert } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material'

function PlayerList ({ players, maxPlayers, highlightedIndex }) {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [removingPlayerId, setRemovingPlayerId] = useState(null);
  const dispatch = useDispatch()

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
        setErrorMessage('');
      } catch (error) {
        console.error('Failed to cancel sign-up:', error)
        handleCloseDialog()
        setErrorMessage('Failed to cancel sign-up. Please try again.')
      }
    }
  }

  return (
    <>
      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <PlayerRow
                key={player.name}
                player={player}
                index={index}
                handleOpenDialog={handleOpenDialog}
                highlightedIndex={
                  highlightedIndex === player.name ? index : null
                }
                isRemoving={removingPlayerId === player.playerId}
              />
            ))}
            {Array.from({ length: maxPlayers - players.length }, (_, index) => (
              <TableRow key={`empty-${index}`}>
                <TableCell component='th' scope='row'>
                  {players.length + index + 1}
                </TableCell>
                <TableCell></TableCell>
                <TableCell align='right'>
                  <Checkbox disabled />
                </TableCell>
                <TableCell align='right'>
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
  )
}

export default PlayerList
