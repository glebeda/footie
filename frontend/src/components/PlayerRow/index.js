import React, { forwardRef } from 'react';
import PaidCheckbox from '../PaidCheckbox';
import CancelIcon from '@mui/icons-material/Cancel'
import './PlayerRow.css'
import { TableCell, TableRow, IconButton } from '@mui/material'

const PlayerRow = forwardRef(({ player, index, handleOpenDialog, highlightedIndex, isRemoving, showAlert, hideAlert }, ref) => {

  const rowClasses = [
    index === highlightedIndex ? 'highlighted-row' : '',
    isRemoving ? 'removing' : '',
  ].filter(Boolean).join(' ');

  return (
    <TableRow ref={ref} className={rowClasses}>
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
  );
});

export default PlayerRow
