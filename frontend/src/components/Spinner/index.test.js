import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './index';

describe('Spinner', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Spinner />);
    expect(asFragment()).toMatchSnapshot();

    // Check that the spinner is in the document
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
