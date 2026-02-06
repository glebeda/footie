import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material';

const ConfirmationDialog = ({ open, message, onConfirm, onCancel }) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} variant="outlined" color="primary" sx={{ marginRight: 1 }}>
        No
      </Button>
      <Button onClick={onConfirm} variant="contained" color="error">
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
