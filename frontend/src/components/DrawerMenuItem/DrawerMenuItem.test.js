import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DrawerMenuItem from './index';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';

describe('DrawerMenuItem', () => {
    const theme = createTheme({
      palette: {
        primary: { main: '#2ECC71' },
        action: {
          selected: '#f0f0f0',
          hover: '#e0e0e0',
        },
      },
    });
  
    const mockOnClick = jest.fn();
  
    const defaultProps = {
      text: 'Attendance',
      path: '/attendance',
      icon: <div data-testid="menu-icon">Icon</div>,
      onClick: mockOnClick,
    };
  
    const renderComponent = (initialRoute = '/') =>
      render(
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[initialRoute]}>
            <DrawerMenuItem {...defaultProps} />
          </MemoryRouter>
        </ThemeProvider>
      );
  
    it('renders the menu item with text and icon', () => {
      renderComponent();
      expect(screen.getByText('Attendance')).toBeInTheDocument();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });
  
    it('applies active styles when the route matches', () => {
      renderComponent('/attendance');
      const listItemLink = screen.getByRole('link', { name: /attendance/i });
      expect(listItemLink).toHaveClass('active');
      expect(listItemLink).toHaveStyle(
        `background-color: ${theme.palette.action.selected}`
      );
      expect(listItemLink).toHaveStyle(`color: ${theme.palette.primary.main}`);
      const listItemText = screen.getByText('Attendance');
      expect(listItemText).toHaveStyle('font-weight: inherit');
    });
  
    it('does not apply active styles when the route does not match', () => {
      renderComponent('/other-route');
      const listItemLink = screen.getByRole('link', { name: /attendance/i });
      expect(listItemLink).not.toHaveClass('active');
      expect(listItemLink).not.toHaveStyle(
        `background-color: ${theme.palette.action.selected}`
      );
      expect(listItemLink).not.toHaveStyle(`color: ${theme.palette.primary.main}`);
      const listItemText = screen.getByText('Attendance');
      expect(listItemText).toHaveStyle('font-weight: inherit');
    });
  
    it('calls onClick when clicked', () => {
      renderComponent();
      const listItemLink = screen.getByRole('link', { name: /attendance/i });
      fireEvent.click(listItemLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });