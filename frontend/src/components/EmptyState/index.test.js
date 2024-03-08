import React from 'react';
import { render } from '@testing-library/react';
import EmptyState from './index';

describe('EmptyState', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<EmptyState />);
    expect(asFragment()).toMatchSnapshot();
  });
});
