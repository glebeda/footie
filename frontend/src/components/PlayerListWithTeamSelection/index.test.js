import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerListWithTeamSelection from './index';

// Mock PlayerRowWithTeamSelection to isolate tests
jest.mock('../PlayerRowWithTeamSelection', () => ({ player, index, team, handleTeamChange }) => (
  <tr>
    <td>{index}</td>
    <td>{player.name}</td>
    <td>{team}</td>
  </tr>
));

describe('PlayerListWithTeamSelection', () => {
  const players = [
    { playerId: '1', name: 'Player One', role: 'MAIN' },
    { playerId: '2', name: 'Player Two', role: 'MAIN' },
    { playerId: '3', name: 'Player Three', role: 'SUBSTITUTE' }
  ];
  const teamAssignments = { '1': 'LIGHTS', '2': 'DARKS' };
  const handleTeamChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the table headers correctly', () => {
    render(
      <PlayerListWithTeamSelection
        players={players}
        teamAssignments={teamAssignments}
        handleTeamChange={handleTeamChange}
      />
    );

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('renders PlayerRowWithTeamSelection components for main players', () => {
    render(
      <PlayerListWithTeamSelection
        players={players}
        teamAssignments={teamAssignments}
        handleTeamChange={handleTeamChange}
      />
    );

    expect(screen.getByText('Player One')).toBeInTheDocument();
    expect(screen.getByText('Player Two')).toBeInTheDocument();
    expect(screen.queryByText('Player Three')).not.toBeInTheDocument();
  });

  it('passes the correct props to PlayerRowWithTeamSelection', () => {
    render(
      <PlayerListWithTeamSelection
        players={players}
        teamAssignments={teamAssignments}
        handleTeamChange={handleTeamChange}
      />
    );

    const firstPlayerRow = screen.getByText('Player One').closest('tr');
    const secondPlayerRow = screen.getByText('Player Two').closest('tr');

    expect(firstPlayerRow).toHaveTextContent('1'); // Index
    expect(firstPlayerRow).toHaveTextContent('Player One');
    expect(firstPlayerRow).toHaveTextContent('LIGHTS');

    expect(secondPlayerRow).toHaveTextContent('2'); // Index
    expect(secondPlayerRow).toHaveTextContent('Player Two');
    expect(secondPlayerRow).toHaveTextContent('DARKS');
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <PlayerListWithTeamSelection
        players={players}
        teamAssignments={teamAssignments}
        handleTeamChange={handleTeamChange}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
