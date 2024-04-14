const express = require('express')
const router = express.Router()
const signupModel = require('../../models/signupModel')
const signupService = require('../../services/signupService')

router.post('/', async (req, res) => {
  const { gameId, playerName } = req.body
  try {
    const newSignUp = await signupService.addSignUp(gameId, playerName)
    res.status(201).json(newSignUp)
  } catch (error) {
    console.error('Sign-up error:', error.message)
    switch (error.message) {
      case 'Player is already signed up for this game':
        return res.status(409).json({ error: error.message })
      case 'Cannot sign up, the game is already full':
        return res.status(403).json({ error: error.message })
      case 'Name parameter is required and must not be empty.':
        return res.status(400).json({ error: error.message })
      default:
        return res.status(500).json({ error: 'Internal server error' })
    }
  }
})

router.get('/upcoming', async (req, res) => {
  try {
    const data = await signupService.getUpcomingGameWithSignups()
    if (!data.game) {
      return res.status(404).json({ message: 'No upcoming games found' })
    }
    res.json(data)
  } catch (error) {
    console.error(`Error fetching upcoming game with signups:`, error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params
  try {
    const signUps = await signupModel.getSignUpsForGame(gameId)
    res.json(signUps)
  } catch (error) {
    console.error('Failed to retrieve sign-ups:', error)
    res.status(500).json({ error: error.toString() })
  }
})

router.delete('/:gameId/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params
  try {
    const result = await signupService.cancelSignUp(gameId, playerId)
    res
      .status(200)
      .json({ message: 'Sign-up canceled successfully', ...result })
  } catch (error) {
    console.error('Cancel sign-up error:', error.message)
    if (error.message === 'Sign-up does not exist') {
      return res.status(404).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
})

router.patch('/:gameId/:playerId/pay', async (req, res) => {
  const { gameId, playerId } = req.params
  const paid = true

  try {
    const updatedSignUp = await signupService.updateSignUpPaymentStatus(
      gameId,
      playerId,
      paid
    )
    res.status(200).json({
      message: 'Payment status to paid updated successfully',
      updatedSignUp
    })
  } catch (error) {
    console.error('Failed to update payment status to paid:', error)
    res.status(500).json({ error: error.toString() })
  }
})

router.patch('/:gameId/:playerId/unpay', async (req, res) => {
  const { gameId, playerId } = req.params
  const paid = false

  try {
    const updatedSignUp = await signupService.updateSignUpPaymentStatus(
      gameId,
      playerId,
      paid
    )
    res.status(200).json({
      message: 'Payment status updated to unpaid successfully',
      updatedSignUp
    })
  } catch (error) {
    console.error('Failed to update payment status to unpaid:', error)
    res.status(500).json({ error: error.toString() })
  }
})

router.patch('/:gameId/:playerId/team', async (req, res) => {
  const { gameId, playerId } = req.params;
  const { team } = req.body;

  try {
    const updatedSignUp = await signupService.updateTeamAssignment(gameId, playerId, team);
    res.status(200).json({
      message: 'Team updated successfully',
      updatedSignUp
    });
  } catch (error) {
    console.error('Failed to update sign up team:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
