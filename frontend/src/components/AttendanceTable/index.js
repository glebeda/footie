import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
  } from '@mui/material';
import './AttendanceTable.css'; 

const AttendanceTable = ({ data }) => {
    return (
      <TableContainer className='attendance-table-container' component={Paper}>
        <div className="attendance-title">
          <Typography variant="h6" component="div">
            Attendance List
          </Typography>
        </div>
        <Table aria-label='attendance table'>
          <TableHead>
            <TableRow>
              <TableCell className='fixed-width'>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Attendance Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((player, index) => (
              <TableRow key={player.playerId}>
                <TableCell className='fixed-width' component='th' scope='row'>
                  {index + 1}
                </TableCell>
                <TableCell>{player.playerName}</TableCell>
                <TableCell align='right'>{player.attendanceCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

export default AttendanceTable;
