import React from 'react';
import './TeamPlayerList.css';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function TeamPlayerList({ teamName, players }) {
  return (
    <TableContainer className={`team-player-list-container ${teamName.toLowerCase()}`} component={Paper}>
      <div className="team-title">
        {teamName === 'Lights' ? (
          <WbSunnyIcon className="team-icon" />
        ) : (
          <Brightness2Icon className="team-icon" />
        )}
        <Typography variant="h6" component="div">
          {teamName}
        </Typography>
      </div>
      <Table aria-label={`${teamName} table`}>
        <TableHead>
          <TableRow>
            <TableCell className='fixed-width'>#</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={`player-${player.playerId}`} className="team-row">
              <TableCell className='fixed-width' component='th' scope='row'>{index + 1}</TableCell>
              <TableCell>{player.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TeamPlayerList;
