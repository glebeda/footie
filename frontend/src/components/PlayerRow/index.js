import React, { useState } from 'react'
import PaidCheckbox from '../PaidCheckbox';
import CancelIcon from '@mui/icons-material/Cancel'
import './PlayerRow.css'
import { useSwipeable } from 'react-swipeable'
import { TableCell, TableRow, IconButton } from '@mui/material'

const PlayerRow = ({ player, index, handleOpenDialog, highlightedIndex, isRemoving, showAlert, hideAlert }) => {
    const [isSwiping, setIsSwiping] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwiped: eventData => {
      console.log('Swiped!', eventData)
      setIsSwiping(false)
      handleOpenDialog(player)
    },
    onSwiping: eventData => {
      if (Math.abs(eventData.deltaX) > 10) {
        setIsSwiping(true)
      }
    },
  })
  
  const rowClasses = [
    isSwiping ? 'row-swiping' : '',
    index === highlightedIndex ? 'highlighted-row' : '',
    isRemoving ? 'removing' : '',
  ].filter(Boolean).join(' ');

  return (
    <TableRow {...swipeHandlers} className={rowClasses}>
      <TableCell component='th' scope='row'>
        {index + 1}
      </TableCell>
      <TableCell>{player.name}</TableCell>
      <TableCell align='right'>
        <PaidCheckbox 
          player={player} 
          showAlert={showAlert} 
          hideAlert={hideAlert} 
        />
      </TableCell>
      <TableCell align='right' className='cancel-icon-cell'>
        <IconButton onClick={() => handleOpenDialog(player)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default PlayerRow
