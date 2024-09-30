import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material';

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
      <Button onClick={onCancel} variant="outlined" color="primary" sx={{ marginRight: 1 }}>
        No, Keep
      </Button>
      <Button onClick={onConfirm} variant="contained" color="error">
        Yes, Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default CancelDialog;
