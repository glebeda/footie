import React, { forwardRef } from 'react';
import PaidCheckbox from '../PaidCheckbox';
import CancelIcon from '@mui/icons-material/Cancel'
import './PlayerRow.css'
import { TableCell, TableRow, IconButton } from '@mui/material'

const PlayerRow = forwardRef(({ player, index, handleOpenDialog, isHighlighting, isRemoving, showAlert, hideAlert, isSubstitute }, ref) => {

  const rowClasses = [
    isSubstitute ? 'substitute-row' : '', 
    isHighlighting ? 'highlighted-row' : '', 
    isRemoving ? 'removing' : '',
  ].filter(Boolean).join(' ');

  return (
    <TableRow ref={ref} className={rowClasses}>
      <TableCell component='th' scope='row'>
        {index}
      </TableCell>
      <TableCell>{player.name}</TableCell>
      <TableCell align='right'>
        <PaidCheckbox 
          player={player} 
          disabled={isSubstitute} 
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
