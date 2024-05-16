import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamPlayerList from './index';

describe('TeamPlayerList', () => {
  const players = [
    { playerId: '1', name: 'Chuchundra' },
    { playerId: '2', name: 'Buboo' },
    { playerId: '3', name: 'Kookoosya' },
  ];

  it('renders the team title', () => {
    render(<TeamPlayerList teamName="Lights" players={players} />);
    expect(screen.getByText('Lights')).toBeInTheDocument();
  });

  it('renders the correct number of player rows', () => {
    render(<TeamPlayerList teamName="Lights" players={players} />);
    const playerRows = screen.getAllByRole('row');
    expect(playerRows).toHaveLength(players.length + 1);
  });

  it('renders the player names correctly', () => {
    render(<TeamPlayerList teamName="Lights" players={players} />);
    players.forEach(player => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
    });
  });

  it('matches the snapshot with players', () => {
    const { asFragment } = render(<TeamPlayerList teamName="Lights" players={players} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot without players', () => {
    const { asFragment } = render(<TeamPlayerList teamName="Lights" players={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
