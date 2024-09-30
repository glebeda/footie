import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from './index';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { within } from '@testing-library/react';

// Import useMediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Mock useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => jest.fn());

// Mock the Logo image
jest.mock('../../assets/images/logo192.png', () => 'logo.png');

// Mock the DrawerMenuItem component
jest.mock('../DrawerMenuItem', () => ({ text, onClick }) => (
  <div data-testid={`drawer-menu-item-${text}`} onClick={onClick}>
    {text}
  </div>
));

describe('Navigation', () => {
  const theme = createTheme({
    palette: {
      primary: { main: '#2ECC71' },
    },
  });

  const renderComponent = (isMobile = false, initialRoute = '/') => {
    // Mock useMediaQuery to control isMobile
    useMediaQuery.mockReturnValue(isMobile);

    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Navigation />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders desktop navigation with nav items', () => {
    renderComponent(false); // Desktop view
    const appBar = screen.getByRole('banner'); 
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(within(appBar).getByText('Footie')).toBeInTheDocument();

    // Check that navigation links are rendered
    expect(within(appBar).getByText('Sign Up')).toBeInTheDocument();
    expect(within(appBar).getByText('Attendance')).toBeInTheDocument();
    expect(within(appBar).getByText('Admin')).toBeInTheDocument();

    // Menu icon should not be present
    expect(screen.queryByLabelText('menu')).not.toBeInTheDocument();
  });

  it('renders mobile navigation with menu icon', () => {
    renderComponent(true); // Mobile view
    const appBar = screen.getByRole('banner'); 

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(within(appBar).getByText('Footie')).toBeInTheDocument();

    // Menu icon should be present
    expect(screen.getByLabelText('menu')).toBeInTheDocument();

    // Navigation links should not be rendered in the AppBar
    expect(within(appBar).queryByText('Sign Up')).not.toBeInTheDocument();
    expect(within(appBar).queryByText('Attendance')).not.toBeInTheDocument();
    expect(within(appBar).queryByText('Admin')).not.toBeInTheDocument();
  });

  it('opens and closes the drawer on mobile', async () => {
    renderComponent(true); // Mobile view

    // Initially, the drawer should not be in the document
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

    // Open the drawer
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);

    // The drawer should now be in the document
    expect(screen.getByRole('presentation')).toBeInTheDocument();

    // Check that the DrawerMenuItems are rendered
    expect(screen.getByTestId('drawer-menu-item-Sign Up')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-menu-item-Attendance')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-menu-item-Admin')).toBeInTheDocument();

    // Close the drawer by clicking a menu item
    fireEvent.click(screen.getByTestId('drawer-menu-item-Sign Up'));

    // Wait for the drawer to close
    await waitFor(() => {
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });
});
