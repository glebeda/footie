import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import './SignInDialog.css'; 

const SignInDialog = ({ open, onClose }) => {
  const handleGoogleSignIn = () => {
    Auth.federatedSignIn({ provider: 'Google' });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign in to Footie</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center">
          <button
            onClick={handleGoogleSignIn}
            className="googleSignInButton"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
            />
            Sign in with Google
          </button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignInDialog;
