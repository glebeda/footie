import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CancelDialog from './index'; 

describe('CancelDialog', () => {
  const onConfirmMock = jest.fn();
  const onCancelMock = jest.fn();

  it('renders correctly when open', () => {
    render(<CancelDialog open={true} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    expect(screen.getByText('Are you sure you want to cancel sign-up?')).toBeInTheDocument();
  });

  it('does not render dialog content when not open', () => {
    render(<CancelDialog open={false} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    expect(screen.queryByText('Are you sure you want to cancel sign-up?')).not.toBeInTheDocument();
  });

  it('calls onCancel when No, Keep is clicked', () => {
    render(<CancelDialog open={true} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    fireEvent.click(screen.getByText('No, Keep'));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Yes, Cancel is clicked', () => {
    render(<CancelDialog open={true} onConfirm={onConfirmMock} onCancel={onCancelMock} />);
    fireEvent.click(screen.getByText('Yes, Cancel'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

});
