import React from 'react';
import { Button } from '@mui/material';

const PrimaryButton = ({ children, onClick, disabled, style }) => (
  <Button
    type="submit"
    variant="contained"
    color="primary"
    onClick={onClick}
    disabled={disabled}
    style={{ marginBottom: '20px', ...style }}
  >
    {children}
  </Button>
);

export default PrimaryButton;