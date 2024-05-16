import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerRowWithTeamSelection from './index';

describe('PlayerRowWithTeamSelection', () => {
  const player = { playerId: '1', name: 'Player One' };
  const index = 1;
  const team = 'LIGHTS';
  const handleTeamChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the player name', () => {
    render(
      <PlayerRowWithTeamSelection
        player={player}
        index={index}
        team={team}
        handleTeamChange={handleTeamChange}
      />
    );

    expect(screen.getByText('Player One')).toBeInTheDocument();
  });

  it('renders the radio buttons with correct values', () => {
    render(
      <PlayerRowWithTeamSelection
        player={player}
        index={index}
        team={team}
        handleTeamChange={handleTeamChange}
      />
    );

    const lightsRadio = screen.getByLabelText('Lights');
    const darksRadio = screen.getByLabelText('Darks');

    expect(lightsRadio).toBeInTheDocument();
    expect(darksRadio).toBeInTheDocument();
    expect(lightsRadio.checked).toBe(true);
    expect(darksRadio.checked).toBe(false);
  });

  it('calls handleTeamChange with the correct value when a radio button is selected', () => {
    render(
      <PlayerRowWithTeamSelection
        player={player}
        index={index}
        team={team}
        handleTeamChange={handleTeamChange}
      />
    );

    const darksRadio = screen.getByLabelText('Darks');
    fireEvent.click(darksRadio);

    expect(handleTeamChange).toHaveBeenCalledWith('1', 'DARKS');
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <PlayerRowWithTeamSelection
        player={player}
        index={index}
        team={team}
        handleTeamChange={handleTeamChange}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
