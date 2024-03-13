import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PlayerRow from './index';

jest.mock('../PaidCheckbox', () => () => <div>PaidCheckbox Mock</div>);
jest.mock('@mui/icons-material/Cancel', () => () => <span>CancelIcon Mock</span>);

describe('PlayerRow', () => {
  const playerMock = { name: 'Player 1', paid: false, PlayerId: '1', gameId: 'game1' };
  const handleOpenDialogMock = jest.fn();
  const showAlertMock = jest.fn();
  const hideAlertMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { asFragment } = render(
      <PlayerRow
        player={playerMock}
        index={0}
        handleOpenDialog={handleOpenDialogMock}
        highlightedIndex={null}
        isRemoving={false}
        showAlert={showAlertMock}
        hideAlert={hideAlertMock}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('calls handleOpenDialog on cancel icon click', () => {
    render(
      <PlayerRow
        player={playerMock}
        index={0}
        handleOpenDialog={handleOpenDialogMock}
        highlightedIndex={null}
        isRemoving={false}
        showAlert={showAlertMock}
        hideAlert={hideAlertMock}
      />
    );

    fireEvent.click(screen.getByText('CancelIcon Mock'));
    expect(handleOpenDialogMock).toHaveBeenCalledWith(playerMock);
  });

  it('applies highlighted-row class when index equals highlightedIndex', () => {
    render(
      <PlayerRow
        player={playerMock}
        index={0}
        handleOpenDialog={handleOpenDialogMock}
        highlightedIndex={0}
        isRemoving={false}
      />
    );

    expect(screen.getByText(playerMock.name).closest('tr')).toHaveClass('highlighted-row');
  });

  it('does not apply highlighted-row class when index does not equal highlightedIndex', () => {
    render(
      <PlayerRow
        player={playerMock}
        index={0}
        handleOpenDialog={handleOpenDialogMock}
        highlightedIndex={1} // Different index
        isRemoving={false}
      />
    );

    expect(screen.getByText(playerMock.name).closest('tr')).not.toHaveClass('highlighted-row');
  });

  it('applies removing class when isRemoving is true', () => {
    render(
      <PlayerRow
        player={playerMock}
        index={0}
        handleOpenDialog={handleOpenDialogMock}
        highlightedIndex={null}
        isRemoving={true}
      />
    );

    expect(screen.getByText(playerMock.name).closest('tr')).toHaveClass('removing');
  });

  it('does not apply removing class when isRemoving is false', () => {
    render(
      <PlayerRow
        player={playerMock}
        index={0}
        handleOpenDialog={handleOpenDialogMock}
        highlightedIndex={null}
        isRemoving={false}
      />
    );

    expect(screen.getByText(playerMock.name).closest('tr')).not.toHaveClass('removing');
  });

  it('assigns ref to the TableRow component', () => {
    const ref = React.createRef();
    render(
      <table>
        <tbody>
          <PlayerRow
            ref={ref}
            player={playerMock}
            index={0}
            handleOpenDialog={handleOpenDialogMock}
            highlightedIndex={0}
            isRemoving={false}
            showAlert={showAlertMock}
            hideAlert={hideAlertMock}
          />
        </tbody>
      </table>
    );
  
    expect(ref.current.tagName).toBe('TR');
  });

});
