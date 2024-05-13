import React, { forwardRef } from 'react';
import PaidCheckbox from '../PaidCheckbox';
import CancelIcon from '@mui/icons-material/Cancel'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import './PlayerRow.css'
import { TableCell, TableRow, IconButton } from '@mui/material'

const PlayerRow = forwardRef(({ 
  player, 
  index, 
  handleOpenDialog,
  isHighlighting,
  isRemoving,
  showAlert,
  hideAlert,
  isSubstitute,
  hasTeamAssignments }, ref) => {
 
  let teamIconContent;
  if (player.team === 'LIGHTS') {
    teamIconContent = <WbSunnyIcon style={{ color: '#fbc02d' }} />;
  } else if (player.team === 'DARKS') {
    teamIconContent = <Brightness2Icon style={{ color: '#607d8b' }} />;
  } else {
    teamIconContent = <div style={{ visibility: 'hidden' }}>None</div>; // Maintain cell structure but hide content
  }

  const rowClasses = [
    isSubstitute ? 'substitute-row' : '', 
    isHighlighting ? 'highlighted-row' : '', 
    isRemoving ? 'removing' : '',
    hasTeamAssignments ? 'team-row' : '',
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
      {hasTeamAssignments ? (
        <TableCell align='center' className="team-icon-cell narrow-cell">{teamIconContent}</TableCell>
      ) : (
        <TableCell style={{ visibility: 'hidden' }} className="team-icon-cell narrow-cell" ></TableCell> // Always render the cell, but hide if no teams
      )}
      <TableCell align='right' className='cancel-icon-cell narrow-cell'>
        <IconButton onClick={() => handleOpenDialog(player)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default PlayerRow
