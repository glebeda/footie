import React, { forwardRef } from 'react';
import { TableCell, TableRow, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const PlayerRowWithTeamSelection = forwardRef(({ player, index, team, handleTeamChange }, ref) => {
    const handleChange = event => {
      handleTeamChange(player.playerId, event.target.value);
    };
  
    return (
      <TableRow ref={ref} className='team-selection-row'>
        <TableCell className='fixed-width' component='th' scope='row'>
          {index}
        </TableCell>
        <TableCell>{player.name}</TableCell>
        <TableCell align='right'>
          <RadioGroup row value={team} onChange={handleChange}>
            <FormControlLabel value='LIGHTS' control={<Radio />} label='Lights' />
            <FormControlLabel value='DARKS' control={<Radio />} label='Darks' />
          </RadioGroup>
        </TableCell>
      </TableRow>
    );
  });

  export default PlayerRowWithTeamSelection;



