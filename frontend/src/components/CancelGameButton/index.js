import React from 'react'
import PrimaryButton from '../PrimaryButton'

const CancelGameButton = ({ onCancelGame, gameId, isGameIdAvailable, isCancelling }) => {
    console.log('isGameIdAvailable:', isGameIdAvailable);
    return (
    <PrimaryButton
      onClick={() => onCancelGame(gameId)}
      color='secondary'
      disabled={!isGameIdAvailable || isCancelling}
      style={{ marginLeft: 'auto' }}
    >
      Cancel Upcoming Game
    </PrimaryButton>
  )
}

export default CancelGameButton
