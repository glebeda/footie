import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDialog from './index';

describe('ConfirmationDialog', () => {
  const onConfirmMock = jest.fn();
  const onCancelMock = jest.fn();
  const message = 'Are you sure you want to cancel sign-up?';

  it('renders correctly when open', () => {
    render(<ConfirmationDialog open={true} message={message} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('does not render dialog content when not open', () => {
    render(<ConfirmationDialog open={false} message={message} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('calls onCancel when No is clicked', () => {
    render(<ConfirmationDialog open={true} message={message} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    fireEvent.click(screen.getByText('No'));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Yes is clicked', () => {
    render(<ConfirmationDialog open={true} message={message} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

});
