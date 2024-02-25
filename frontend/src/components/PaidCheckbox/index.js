import React from 'react';
import { Checkbox } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updatePaymentStatus } from '../../api/signupService';
import { updatePlayerPaidStatus } from '../../redux/slices/signupSlice';

const PaidCheckbox = ({ player, showAlert, hideAlert }) => {
  const dispatch = useDispatch();

  const handlePaymentStatusChange = async (event) => {
    try {
      const paidStatus = event.target.checked;
      await updatePaymentStatus(player.gameId, player.PlayerId, paidStatus);
      dispatch(updatePlayerPaidStatus({ playerId: player.PlayerId, paid: paidStatus }));
      console.log('Payment status updated successfully');
      hideAlert();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      showAlert('Failed to update payment status. Please try again.');
    }
  };

  return (
    <Checkbox
      checked={player.hasPaid}
      onChange={handlePaymentStatusChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
};

export default PaidCheckbox;
