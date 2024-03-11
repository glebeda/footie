import { createSlice } from '@reduxjs/toolkit';

export const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    players: [],
    gameDetails: null, 
    isLoadingGameDetails: false, 
    hasSignedUp: false,
  },
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setGameDetails: (state, action) => {
      state.gameDetails = action.payload;
    },
    setLoadingState: (state, action) => {
      state.isLoadingGameDetails = action.payload;
    },
    setHasSignedUp: (state, action) => {
      state.hasSignedUp = action.payload;
    },
    setHasPaid: (state, action) => {
      state.hasPaid = action.payload;
    },
    removePlayer: (state, action) => {
      state.players = state.players.filter(player => player.playerId !== action.payload.playerId);
    },
    addPlayer: (state, action) => {
      state.players.push(action.payload);
    },
    updatePlayerPaidStatus: (state, action) => {
      const { playerId, paid } = action.payload;
      const playerIndex = state.players.findIndex(player => player.playerId === playerId);
      if (playerIndex !== -1) {
        state.players[playerIndex].hasPaid = paid;
      }
    },
    setGameNotFound: (state) => {
      state.gameDetails = null;  
      state.players = [];        
    },
  },
});

export const { setPlayers, setGameDetails, setHasSignedUp, setHasPaid, 
  removePlayer, updatePlayerPaidStatus, setGameNotFound, setLoadingState, addPlayer } = signupSlice.actions;

export default signupSlice.reducer;
