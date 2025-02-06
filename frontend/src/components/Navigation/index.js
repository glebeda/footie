import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  useMediaQuery,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Logo from '../../assets/images/logo192.png'; 
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DrawerMenuItem from '../DrawerMenuItem';
import HistoryIcon from '@mui/icons-material/History';

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Sign Up', path: '/', icon: <HowToRegIcon /> },
    { text: 'Attendance', path: '/attendance', icon: <EventAvailableIcon /> },
    { text: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
    { text: 'Past Matches', path: '/history', icon: <HistoryIcon /> },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Footie
      </Typography>
      <List>
        {navItems.map((item) => (
            <DrawerMenuItem
                key={item.text}
                text={item.text}
                path={item.path}
                icon={item.icon}
                onClick={handleDrawerToggle}
            />
      ))} 
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#FFFFFF', color: '#2C3E50' }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
              <Typography variant="h6" component="div">
                Footie
              </Typography>
            </>
          ) : (
            <>
              <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Footie
              </Typography>
              {navItems.map((item) => (
                <NavLink
                  key={item.text}
                  to={item.path}
                  style={({ isActive }) => ({
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    textDecoration: 'none',
                    marginLeft: theme.spacing(2),
                    fontWeight: isActive ? 'bold' : 'normal',
                    borderBottom: isActive
                      ? `4px solid ${theme.palette.primary.main}`
                      : '4px solid transparent', 
                    paddingBottom: '4px', 
                  })}
                >
                  {item.text}
                </NavLink>
              ))}
            </>
          )}
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default Navigation;
