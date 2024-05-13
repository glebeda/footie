import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './PlayerListWithTeamSelection.css';
import PlayerRowWithTeamSelection from '../PlayerRowWithTeamSelection'

function PlayerListWithTeamSelection({ players, teamAssignments, handleTeamChange }) {
  
  const mainPlayers = players.filter(player => player.role === 'MAIN');  

  return (
    <TableContainer className='player-list-container' component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align='left'>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mainPlayers.map((player, index) => (
            <PlayerRowWithTeamSelection
              key={`player-${player.playerId}`}
              player={player}
              index={index + 1}
              team={teamAssignments[player.playerId] || ''} 
              handleTeamChange={handleTeamChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerListWithTeamSelection;
