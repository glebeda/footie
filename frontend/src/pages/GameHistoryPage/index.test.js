import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameHistoryPage from './index';

// Mock the entire api modules
jest.mock('../../api/gameService', () => ({
  getPastGames: jest.fn()
}));

jest.mock('../../api/signupService', () => ({
  getGameWithSignups: jest.fn()
}));

// Mock the components
jest.mock('../../components/LoadingState', () => () => <div>Loading...</div>);
jest.mock('../../components/EmptyState', () => ({ message }) => <div>{message}</div>);
jest.mock('../../components/TeamPlayerList', () => ({ teamName, players }) => (
  <div data-testid={`team-${teamName.toLowerCase()}`}>
    {players.map(player => (
      <div key={player.playerId}>{player.name}</div>
    ))}
  </div>
));

// Import the mocked functions after mocking
import { getPastGames } from '../../api/gameService';
import { getGameWithSignups } from '../../api/signupService';

describe('GameHistoryPage', () => {
  const mockPastGames = [
    { gameId: 'game1', date: '2024-01-01T21:00:00Z' },
    { gameId: 'game2', date: '2024-01-08T21:00:00Z' }
  ];

  const mockGameDetails = {
    game: { gameId: 'game1', date: '2024-01-01T21:00:00Z' },
    signUps: [
      { playerId: 'p1', playerName: 'Player 1', team: 'LIGHTS', paid: true },
      { playerId: 'p2', playerName: 'Player 2', team: 'DARKS', paid: false },
      { playerId: 'p3', playerName: 'Player 3', team: 'UNASSIGNED', paid: true }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    getPastGames.mockImplementation(() => new Promise(() => {}));
    render(<GameHistoryPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    getPastGames.mockRejectedValue(new Error('API Error'));
    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Sorry lad, something went wrong while loading the games')).toBeInTheDocument();
    });
  });

  it('shows empty state when no past games exist', async () => {
    getPastGames.mockResolvedValue([]);
    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Sorry lad, no past games found')).toBeInTheDocument();
    });
  });

  it('displays past games and allows selection', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    // Wait for games to load
    await waitFor(() => {
      expect(screen.getByLabelText('Select Match')).toBeInTheDocument();
    });

    // Check if both games are in the dropdown
    const select = screen.getByLabelText('Select Match');
    fireEvent.mouseDown(select);
    
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
  });

  it('displays team lists when game is selected', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByLabelText('Select Match')).toBeInTheDocument();
    });

    // Wait for team lists to appear
    await waitFor(() => {
      expect(screen.getByTestId('team-lights')).toBeInTheDocument();
      expect(screen.getByTestId('team-darks')).toBeInTheDocument();
      expect(screen.getByTestId('team-unassigned')).toBeInTheDocument();
    });

    // Check if players are displayed in correct teams
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
  });

  it('fetches new game details when different game is selected', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByLabelText('Select Match')).toBeInTheDocument();
    });

    // Select a different game
    const select = screen.getByLabelText('Select Match');
    fireEvent.mouseDown(select);
    const options = await screen.findAllByRole('option');
    fireEvent.click(options[1]);

    // Verify that getGameWithSignups was called with the new game ID
    expect(getGameWithSignups).toHaveBeenCalledWith(mockPastGames[1].gameId);
  });
}); 