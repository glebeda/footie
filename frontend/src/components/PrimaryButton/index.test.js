import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PrimaryButton from './index';

describe('PrimaryButton', () => {
  const buttonText = "Submit";
  const onClickMock = jest.fn();

  it('renders correctly', () => {
    const { asFragment } = render(
      <PrimaryButton onClick={onClickMock}>
        {buttonText}
      </PrimaryButton>
    );
    expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onClick callback when clicked', () => {
    render(
      <PrimaryButton onClick={onClickMock}>
        {buttonText}
      </PrimaryButton>
    );
    fireEvent.click(screen.getByRole('button', { name: buttonText }));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <PrimaryButton onClick={onClickMock} disabled={true}>
        {buttonText}
      </PrimaryButton>
    );
    expect(screen.getByRole('button', { name: buttonText })).toBeDisabled();
  });

  it('applies custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    render(
      <PrimaryButton onClick={onClickMock} style={customStyle}>
        {buttonText}
      </PrimaryButton>
    );
    expect(screen.getByRole('button', { name: buttonText })).toHaveStyle(customStyle);
  });
});
