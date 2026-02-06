import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertComponent from './index';

describe('AlertComponent', () => {
  it('renders the message inline by default when open', () => {
    render(<AlertComponent message="Test Alert" severity="error" open={true} onClose={() => {}} />);
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('does not render when not open', () => {
    const { container } = render(<AlertComponent message="Test Alert" severity="error" open={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('matches the snapshot for inline mode when open', () => {
    const { asFragment } = render(<AlertComponent message="Test Alert" severity="error" open={true} onClose={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot for toast mode when open', () => {
    const { asFragment } = render(
      <AlertComponent message="Test Alert" severity="error" open={true} onClose={() => {}} mode="toast" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot when not open', () => {
    const { asFragment } = render(<AlertComponent message="Test Alert" severity="error" open={false} onClose={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
  
});
