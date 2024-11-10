import React from 'react';
import { styled } from '@mui/material/styles';

const LogoutButtonStyled = styled('button')(({ theme, drawerMode }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: drawerMode ? 'auto' : '40px',
  padding: drawerMode ? theme.spacing(1) : '8px 24px',
  border: `1px solid`,
  borderRadius: '4px',
  backgroundColor: 'transparent',
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

const LogoutButton = ({ onClick, drawerMode = false }) => {
  return (
    <LogoutButtonStyled onClick={onClick} drawerMode={drawerMode}>
      Log Out
    </LogoutButtonStyled>
  );
};

export default LogoutButton;