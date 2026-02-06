import React from 'react'
import PrimaryButton from '../PrimaryButton'

const CancelGameButton = ({ onCancelGame, isGameIdAvailable, isCancelling }) => {
  return (
    <PrimaryButton
      onClick={onCancelGame}
      color='secondary'
      disabled={!isGameIdAvailable || isCancelling}
      style={{ marginLeft: 'auto' }}
    >
      Cancel Upcoming Game
    </PrimaryButton>
  )
}

export default CancelGameButton
