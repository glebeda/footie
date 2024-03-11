const {
  addSignUp,
  cancelSignUp,
  updateSignUpPaymentStatus
} = require('../../src/services/signupService')
const signupModel = require('../../src/models/signupModel')
const gameModel = require('../../src/models/gameModel')
const playerService = require('../../src/services/playerService')
jest.mock('../../src/models/signupModel', () => ({
  addSignUp: jest.fn().mockResolvedValue(true),
  checkSignUpExists: jest.fn().mockResolvedValue(false),
  getSignUpsForGame: jest.fn().mockResolvedValue([]),
  deleteSignUp: jest.fn().mockResolvedValue({}),
  updatePaymentStatus: jest.fn().mockResolvedValue({ Paid: false })
}))

jest.mock('../../src/models/gameModel', () => ({
  getGameById: jest.fn().mockResolvedValue({ Status: 'OPEN', MaxPlayers: 10 }),
  updateGameStatus: jest.fn().mockResolvedValue({})
}))

jest.mock('../../src/services/playerService', () => ({
  ensureUniquePlayer: jest.fn().mockResolvedValue({ PlayerId: 'player123' })
}))

describe('signupService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addSignUp', () => {
    it('successfully adds a new sign-up', async () => {
      const result = await addSignUp('Tuesday Game', 'John Psina')

      expect(result).toEqual({ Success: true, PlayerId: "player123", Message: 'Sign-up successful' })
      expect(gameModel.getGameById).toHaveBeenCalledWith('Tuesday Game')
      expect(playerService.ensureUniquePlayer).toHaveBeenCalledWith(
        'John Psina'
      )
      expect(signupModel.checkSignUpExists).toHaveBeenCalledWith(
        'Tuesday Game',
        'player123'
      )
      expect(signupModel.addSignUp).toHaveBeenCalledWith(
        'Tuesday Game',
        'player123'
      )
    })

    it('throws an error when the game is full', async () => {
      gameModel.getGameById.mockResolvedValue({
        Status: 'FULL',
        MaxPlayers: 10
      })

      await expect(addSignUp('Tuesday Game', 'John Psina')).rejects.toThrow(
        'Cannot sign up, the game is already full'
      )

      expect(gameModel.getGameById).toHaveBeenCalledWith('Tuesday Game')
      expect(playerService.ensureUniquePlayer).not.toHaveBeenCalled()
      expect(signupModel.checkSignUpExists).not.toHaveBeenCalled()
      expect(signupModel.addSignUp).not.toHaveBeenCalled()
    })

    it('throws an error for a duplicate sign-up attempt', async () => {
      gameModel.getGameById.mockResolvedValue({
        Status: 'OPEN',
        MaxPlayers: 10
      })
      playerService.ensureUniquePlayer.mockResolvedValue({
        PlayerId: 'John Psina'
      })
      signupModel.checkSignUpExists.mockResolvedValue(true)

      await expect(addSignUp('Tuesday Game', 'John Psina')).rejects.toThrow(
        'Player is already signed up for this game'
      )

      expect(gameModel.getGameById).toHaveBeenCalledWith('Tuesday Game')
      expect(playerService.ensureUniquePlayer).toHaveBeenCalledWith(
        'John Psina'
      )
      expect(signupModel.checkSignUpExists).toHaveBeenCalledWith(
        'Tuesday Game',
        'John Psina'
      )
    })
  })
  describe('cancelSignUp', () => {
    it('successfully cancels a sign-up', async () => {
      signupModel.checkSignUpExists.mockResolvedValue(true)
      signupModel.deleteSignUp.mockResolvedValue({})

      const result = await cancelSignUp('Tuesday Game', 'Valera')

      expect(result).toEqual({ gameId: 'Tuesday Game', playerId: 'Valera' })
      expect(signupModel.checkSignUpExists).toHaveBeenCalledWith(
        'Tuesday Game',
        'Valera'
      )
      expect(signupModel.deleteSignUp).toHaveBeenCalledWith(
        'Tuesday Game',
        'Valera'
      )
    })

    it('throws an error when trying to cancel a non-existent sign-up', async () => {
      signupModel.checkSignUpExists.mockResolvedValue(false)

      await expect(cancelSignUp('Argentina Game', 'Messi')).rejects.toThrow(
        'Sign-up does not exist'
      )

      expect(signupModel.checkSignUpExists).toHaveBeenCalledWith(
        'Argentina Game',
        'Messi'
      )
      expect(signupModel.deleteSignUp).not.toHaveBeenCalled()
    })

    it('updates the game status to OPEN after cancellation if below max players', async () => {
      signupModel.checkSignUpExists.mockResolvedValue(true)
      gameModel.getGameById.mockResolvedValue({
        Status: 'FULL',
        MaxPlayers: 10
      })
      signupModel.getSignUpsForGame.mockResolvedValue(
        Array(9).fill({ PlayerId: 'player' })
      )

      await cancelSignUp('Tuesday Game', 'Ronaldo')

      expect(signupModel.checkSignUpExists).toHaveBeenCalledWith(
        'Tuesday Game',
        'Ronaldo'
      )
      expect(signupModel.deleteSignUp).toHaveBeenCalledWith(
        'Tuesday Game',
        'Ronaldo'
      )
      expect(gameModel.getGameById).toHaveBeenCalledWith('Tuesday Game')
      expect(signupModel.getSignUpsForGame).toHaveBeenCalledWith('Tuesday Game')
      expect(gameModel.updateGameStatus).toHaveBeenCalledWith(
        'Tuesday Game',
        'OPEN'
      )
    })
  })

  describe('updateSignUpPaymentStatus', () => {
    it('successfully updates the payment status to paid', async () => {
      const gameId = 'Tuesday Game'
      const playerId = 'qwerty'
      const paid = true
      signupModel.updatePaymentStatus.mockResolvedValue({ Paid: true })

      const result = await updateSignUpPaymentStatus(gameId, playerId, paid)

      expect(result).toHaveProperty('Paid', true)
      expect(signupModel.updatePaymentStatus).toHaveBeenCalledWith(
        gameId,
        playerId,
        true
      )
    })

    it('successfully updates the payment status to unpaid', async () => {
      const gameId = 'Sunday Game'
      const playerId = 'Silva'
      const paid = false
      signupModel.updatePaymentStatus.mockResolvedValue({ Paid: false })

      const result = await updateSignUpPaymentStatus(gameId, playerId, paid)

      expect(result).toHaveProperty('Paid', false)
      expect(signupModel.updatePaymentStatus).toHaveBeenCalledWith(
        gameId,
        playerId,
        false
      )
    })

    it('throws an error if the update fails', async () => {
      const gameId = 'Friday Game'
      const playerId = 'valera'
      const paid = true
      const errorMessage = 'Error updating payment status'
      signupModel.updatePaymentStatus.mockRejectedValue(new Error(errorMessage))

      await expect(
        updateSignUpPaymentStatus(gameId, playerId, paid)
      ).rejects.toThrow(errorMessage)
      expect(signupModel.updatePaymentStatus).toHaveBeenCalledWith(
        gameId,
        playerId,
        paid
      )
    })
  })
})
