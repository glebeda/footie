import React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const LoginLink = styled(NavLink, {
  shouldForwardProp: (prop) => prop !== 'drawerMode',
})(({ theme, drawerMode }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: drawerMode ? 'auto' : '40px',
  padding: drawerMode ? theme.spacing(1) : '8px 24px',
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '4px',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  cursor: 'pointer',
  marginLeft: drawerMode ? 'auto' : theme.spacing(6),
  marginRight: drawerMode ? 'auto' : 0,
  marginTop: drawerMode ? theme.spacing(4) : 0,
  width: drawerMode ? '80%' : 'auto',
  '&:hover': {
    backgroundColor: drawerMode ? theme.palette.action.hover : 'transparent',
    textDecoration: 'none',
  },
}));

const LoginButton = ({ onClick, drawerMode = false }) => {
  return (
    <LoginLink to="#" onClick={onClick} drawerMode={drawerMode}>
      Login
    </LoginLink>
  );
};

export default LoginButton;