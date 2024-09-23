import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import DateRangeSelector from './index';

describe('DateRangeSelector', () => {
  const options = ['2023-24', '2022-23', 'All Time'];
  const onChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with given options', () => {
    render(
      <DateRangeSelector dateRange="2023-24" onChange={onChangeMock} options={options} />
    );

    // Check that the label is rendered
    expect(screen.getByLabelText('Select Season')).toBeInTheDocument();

    // Open the select dropdown
    fireEvent.mouseDown(screen.getByLabelText('Select Season'));

    // Get the listbox element (the dropdown menu)
    const listbox = screen.getByRole('listbox');

    // Use 'within' to scope the queries to the listbox
    options.forEach((option) => {
      expect(within(listbox).getByText(option)).toBeInTheDocument();
    });
  });

  it('calls onChange when a different option is selected', () => {
    render(
      <DateRangeSelector dateRange="2023-24" onChange={onChangeMock} options={options} />
    );

    // Open the select dropdown
    fireEvent.mouseDown(screen.getByLabelText('Select Season'));

    // Select a different option
    fireEvent.click(screen.getByText('2022-23'));

    // Ensure onChange is called with the new value
    expect(onChangeMock).toHaveBeenCalledWith('2022-23');
  });
});
