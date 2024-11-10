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
import { useTheme, styled } from '@mui/material/styles';
import Logo from '../../assets/images/logo192.png'; 
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DrawerMenuItem from '../DrawerMenuItem';
import LoginButton from '../LoginButton';
import LogoutButton from '../LogoutButton';
import { Auth } from 'aws-amplify';
import SignInDialog from '../SignInDialog'; 

const Navigation = ({ user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    Auth.signOut();
  };

  const navItems = [
    { text: 'Sign Up', path: '/', icon: <HowToRegIcon /> },
    { text: 'Attendance', path: '/attendance', icon: <EventAvailableIcon /> },
    { text: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
  ];

  const NavItemLink = styled(NavLink)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    padding: '8px 16px',
    marginLeft: theme.spacing(2),
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    borderBottom: '4px solid transparent',
    cursor: 'pointer',
    '&.active': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      borderBottom: `4px solid ${theme.palette.primary.main}`,
    },
    '&:hover': {
      textDecoration: 'none',
    },
  }));

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
        {!user ? (
          <Box sx={{ mt: 1 }}>
            <LoginButton onClick={() => {
              handleDrawerToggle();
              handleLogin();
            }} drawerMode={true} />
            </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <LogoutButton onClick={() => {
              handleDrawerToggle();
              handleLogout();
            }} drawerMode={true} />
          </Box>
        )}
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
                <NavItemLink
                  key={item.text}
                  to={item.path}
                  exact
                >
                  {item.text}
                </NavItemLink>
              ))}
              {user ? (
                <>
                  <Typography variant="body1" sx={{ marginLeft: theme.spacing(2) }}>
                    Hello, {user.attributes?.name || user.username}
                  </Typography>
                  <LogoutButton color="inherit" onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                </>
              ) : (
                <LoginButton onClick={handleLogin} />
              )}
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
      <SignInDialog open={loginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default Navigation;
