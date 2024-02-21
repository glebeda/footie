import React from 'react';
import './PlayerList.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';

function PlayerList({ players, maxPlayers, highlightedIndex }) {
  return (
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
  );
}

export default PlayerList;
