import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminPage from './index';
import { updateGameStatus } from '../../api/gameService';
import AlertComponent from '../../components/AlertComponent';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../api/gameService', () => ({
  createGame: jest.fn(),
  updateGameStatus: jest.fn(),
}));

jest.mock('../../api/signupService', () => ({
  updateMultiplePlayersTeams: jest.fn(),
}));

jest.mock('../../hooks/useGameDetails', () => ({
  useGameDetails: () => ({
    fetchAndSetGameDetails: jest.fn(),
  }),
}));

jest.mock('../../components/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../../components/LoadingState', () => () => <div>Loading...</div>);
jest.mock('../../components/PlayerListWithTeamSelection', () => () => <div>Team Selection</div>);
jest.mock('../../components/PrimaryButton', () => ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} type='button'>
    {children}
  </button>
));
jest.mock('../../components/CancelGameButton', () => ({ onCancelGame }) => (
  <button onClick={onCancelGame} type='button'>
    Cancel Upcoming Game
  </button>
));
jest.mock('../../components/ConfirmationDialog', () => ({ open, message, onConfirm, onCancel }) => (
  open ? (
    <div>
      <p>{message}</p>
      <button onClick={onCancel} type='button'>No</button>
      <button onClick={onConfirm} type='button'>Yes</button>
    </div>
  ) : null
));
jest.mock('../../components/AlertComponent', () =>
  jest.fn(({ open, mode, severity, message }) => (
    open ? <div data-testid='admin-alert'>{`${mode}|${severity}|${message}`}</div> : null
  ))
);

describe('AdminPage', () => {
  const dispatchMock = jest.fn();
  const baseState = {
    signup: {
      players: [],
      gameDetails: {
        gameId: 'game-1',
        date: '2026-02-10T21:00',
        location: 'Goals Chingford',
        maxPlayers: 10,
        maxSubstitutes: 2,
      },
      isLoadingGameDetails: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation(selector => selector(baseState));
  });

  it('shows success toast after confirming game cancellation', async () => {
    updateGameStatus.mockResolvedValue({});

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel Upcoming Game' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => {
      expect(updateGameStatus).toHaveBeenCalledWith('game-1', 'CANCELLED');
    });

    await waitFor(() => {
      expect(
        AlertComponent.mock.calls.some(
          ([props]) =>
            props.mode === 'toast' &&
            props.open === true &&
            props.severity === 'success' &&
            props.message === 'Game cancelled successfully'
        )
      ).toBe(true);
    });
  });

  it('shows error toast when cancellation fails', async () => {
    updateGameStatus.mockRejectedValue(new Error('Cancel failed'));

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel Upcoming Game' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => {
      expect(
        AlertComponent.mock.calls.some(
          ([props]) =>
            props.mode === 'toast' &&
            props.open === true &&
            props.severity === 'error' &&
            props.message === 'Cancel failed'
        )
      ).toBe(true);
    });
  });
});
