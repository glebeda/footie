import React from 'react';
import DialogButton from '../DialogButton';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';

const CancelDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to cancel sign-up?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <DialogButton onClick={onCancel} variant="outlined">
        No, Keep
      </DialogButton>
      <DialogButton onClick={onConfirm} variant="contained" color="primary">
        Yes, Cancel
      </DialogButton>
    </DialogActions>
  </Dialog>
);

export default CancelDialog;
