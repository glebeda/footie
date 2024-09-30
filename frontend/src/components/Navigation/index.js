import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Logo from '../../assets/images/logo192.png'; 

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Sign Up', path: '/' },
    { text: 'Attendance', path: '/attendance' },
    { text: 'Admin', path: '/admin' },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Footie
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding onClick={handleDrawerToggle}>
            <ListItemText>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: theme.spacing(1, 2),
                  textDecoration: 'none',
                  color: isActive ? theme.palette.primary.main : 'inherit',
                })}
              >
                {item.text}
              </NavLink>
            </ListItemText>
          </ListItem>
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
