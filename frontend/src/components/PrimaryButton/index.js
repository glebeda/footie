import React from 'react';
import { Button } from '@mui/material';

const PrimaryButton = ({ children, onClick, disabled, color = "primary", style, className }) => (
  <Button
    type="submit"
    variant="contained"
    color={color}
    onClick={onClick}
    disabled={disabled}
    className={className}
    style={style}
  >
    {children}
  </Button>
);

export default PrimaryButton;