import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CancelGameButton from './index';
import '@testing-library/jest-dom';

describe('CancelGameButton', () => {
  const onCancelGameMock = jest.fn();
  const gameId = '1234';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls onCancelGame with gameId when clicked', () => {
    render(
      <CancelGameButton
        onCancelGame={onCancelGameMock}
        gameId={gameId}
        isGameIdAvailable={true}
        isCancelling={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel Upcoming Game' }));
    expect(onCancelGameMock).toHaveBeenCalledWith(gameId);
  });

  test('is disabled when isGameIdAvailable is false', () => {
    render(
      <CancelGameButton
        onCancelGame={onCancelGameMock}
        gameId={gameId}
        isGameIdAvailable={false}
        isCancelling={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Cancel Upcoming Game' })).toBeDisabled();
  });

  test('is disabled when isCancelling is true', () => {
    render(
      <CancelGameButton
        onCancelGame={onCancelGameMock}
        gameId={gameId}
        isGameIdAvailable={true}
        isCancelling={true}
      />
    );

    expect(screen.getByRole('button', { name: 'Cancel Upcoming Game' })).toBeDisabled();
  });

  test('is enabled when isGameIdAvailable is true and isCancelling is false', () => {
    render(
      <CancelGameButton
        onCancelGame={onCancelGameMock}
        gameId={gameId}
        isGameIdAvailable={true}
        isCancelling={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Cancel Upcoming Game' })).not.toBeDisabled();
  });
});
