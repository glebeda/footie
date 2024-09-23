import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './index';

describe('ErrorMessage', () => {
  it('renders correctly with a message', () => {
    const message = 'An error occurred';
    const { asFragment } = render(<ErrorMessage message={message} />);
    expect(asFragment()).toMatchSnapshot();

    // Check that the message is displayed
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('has the correct role for accessibility', () => {
    render(<ErrorMessage message="Error!" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
