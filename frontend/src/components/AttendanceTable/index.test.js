import React from 'react';
import { render, screen } from '@testing-library/react';
import AttendanceTable from './index';

describe('AttendanceTable', () => {
  const mockData = [
    { playerId: '1', playerName: 'Alice', attendanceCount: 10 },
    { playerId: '2', playerName: 'Bob', attendanceCount: 8 },
    { playerId: '3', playerName: 'Charlie', attendanceCount: 5 },
  ];

  it('renders correctly with data', () => {
    render(<AttendanceTable data={mockData} />);

    // Check if the title is rendered
    expect(screen.getByText('Attendance List')).toBeInTheDocument();

    // Check that the correct number of rows are rendered (1 header + data rows)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);

    // Verify each player's data is displayed
    mockData.forEach((player, index) => {
      expect(screen.getByText(player.playerName)).toBeInTheDocument();
      expect(screen.getByText((index + 1).toString())).toBeInTheDocument();
      expect(screen.getByText(player.attendanceCount.toString())).toBeInTheDocument();
    });
  });

  it('renders correctly without data', () => {
    render(<AttendanceTable data={[]} />);
  
    // Check that the title is rendered
    expect(screen.getByText('Attendance List')).toBeInTheDocument();
  
    // Only the header row should be present
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });
  
});
