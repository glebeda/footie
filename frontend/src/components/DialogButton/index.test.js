import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DialogButton from './index';

describe('DialogButton', () => {
  const buttonText = "Click Me!";
  const onClickMock = jest.fn();

  it('renders correctly with variant="outlined"', () => {
    const { asFragment } = render(
      <DialogButton variant="outlined" onClick={onClickMock}>
        {buttonText}
      </DialogButton>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with variant="contained"', () => {
    const { asFragment } = render(
      <DialogButton variant="contained" onClick={onClickMock}>
        {buttonText}
      </DialogButton>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onClick callback when clicked', () => {
    render(
      <DialogButton variant="outlined" onClick={onClickMock}>
        {buttonText}
      </DialogButton>
    );
    fireEvent.click(screen.getByText(buttonText));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
