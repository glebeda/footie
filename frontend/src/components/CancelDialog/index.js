import React from 'react';
import { Dialog, DialogActions, Button } from '@mui/material';

const CancelDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogActions>
      <Button onClick={onCancel}>No, Keep</Button>
      <Button onClick={onConfirm} color="primary">
        Yes, Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default CancelDialog;
