import React from 'react';
import { Alert } from '@mui/material';

const AlertComponent = ({ message, severity, open, onClose }) => {
  if (!open) return null;

  return (
    <Alert severity={severity} onClose={onClose}>
      {message}
    </Alert>
  );
};

export default AlertComponent;
