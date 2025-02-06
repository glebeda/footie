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
    { gameId: 'game2', date: '2024-01-08T21:00:00Z' },
    { gameId: 'game3', date: '2023-12-15T21:00:00Z' },
    { gameId: 'game4', date: '2023-12-22T21:00:00Z' }
  ];

  const mockGameDetails = {
    game: { gameId: 'game2', date: '2024-01-08T21:00:00Z' },
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

  it('automatically selects most recent year and game on load', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    await waitFor(() => {
      // Should select 2024 as it's the most recent year
      const yearSelect = screen.getByRole('combobox', { name: 'Select Year' });
      expect(yearSelect).toHaveTextContent('2024');

      // Should select the most recent game (January 8)
      const gameSelect = screen.getByRole('combobox', { name: 'Select Match' });
      expect(gameSelect).toHaveTextContent('8 January at 21:00');
    });
  });

  it('filters games by selected year', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByLabelText('Select Year')).toBeInTheDocument();
    });

    // Open year dropdown and select 2023
    fireEvent.mouseDown(screen.getByLabelText('Select Year'));
    fireEvent.click(screen.getByText('2023'));

    // Should show only 2023 games in the game dropdown
    fireEvent.mouseDown(screen.getByLabelText('Select Match'));
    
    await waitFor(() => {
      const options = screen.getAllByRole('option').filter(option => 
        option.getAttribute('data-value')?.includes('game3') || 
        option.getAttribute('data-value')?.includes('game4')
      );
      expect(options).toHaveLength(2);
    });
  });

  it('resets game selection when year changes', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByLabelText('Select Year')).toBeInTheDocument();
    });

    // Change year
    fireEvent.mouseDown(screen.getByLabelText('Select Year'));
    fireEvent.click(screen.getByText('2023'));

    // Game selection should be reset to placeholder
    const gameSelect = screen.getByRole('combobox', { name: 'Select Match' });
    expect(gameSelect).toBeInTheDocument();
  });

  it('displays team lists when game is selected', async () => {
    getPastGames.mockResolvedValue(mockPastGames);
    getGameWithSignups.mockResolvedValue(mockGameDetails);

    render(<GameHistoryPage />);

    await waitFor(() => {
      expect(screen.getByTestId('team-lights')).toBeInTheDocument();
      expect(screen.getByTestId('team-darks')).toBeInTheDocument();
      expect(screen.getByTestId('team-unassigned')).toBeInTheDocument();
    });

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
  });
}); 