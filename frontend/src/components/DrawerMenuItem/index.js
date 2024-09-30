import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const DrawerMenuItem = ({ text, path, icon, onClick }) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding onClick={onClick}>
      <ListItemButton
        component={NavLink}
        to={path}
        sx={{
          pl: 4,
          '&.active': {
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.primary.main,
            '& .MuiListItemText-root': {
              fontWeight: 'bold',
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            color: 'inherit',
            fontWeight: 'inherit',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default DrawerMenuItem;
