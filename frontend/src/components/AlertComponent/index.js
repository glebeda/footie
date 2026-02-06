import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertComponent = ({
  message,
  severity,
  open,
  onClose,
  mode = 'inline',
  autoHideDuration = 4000,
  anchorOrigin = { vertical: 'top', horizontal: 'center' }
}) => {
  if (!open) return null;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  if (mode === 'toast') {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert severity={severity} onClose={handleClose} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Alert severity={severity} onClose={onClose}>
      {message}
    </Alert>
  );
};

export default AlertComponent;
