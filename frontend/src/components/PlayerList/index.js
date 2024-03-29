import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { removePlayer } from '../../redux/slices/signupSlice'
import { cancelSignUp } from '../../api/signupService'
import PlayerRow from '../PlayerRow'
import './PlayerList.css'
import CancelDialog from '../CancelDialog'
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

function PlayerList ({ players, maxPlayers, highlightedIndex, showAlert, hideAlert, signupOccurred }) {
  const lastRowRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [removingPlayerId, setRemovingPlayerId] = useState(null);
  const dispatch = useDispatch()

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
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Paid</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <PlayerRow
                key={player.name}
                player={player}
                ref={index === players.length - 1 ? lastRowRef : null} 
                index={index}
                handleOpenDialog={handleOpenDialog}
                highlightedIndex={
                  highlightedIndex === player.playerId ? index : null
                }
                isRemoving={removingPlayerId === player.playerId}
                showAlert={showAlert} 
                hideAlert={hideAlert} 
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
