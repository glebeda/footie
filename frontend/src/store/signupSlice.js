import { createSlice } from '@reduxjs/toolkit';

export const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    players: [],
    hasSignedUp: false,
    hasPaid: false,
  },
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setHasSignedUp: (state, action) => {
      state.hasSignedUp = action.payload;
    },
    setHasPaid: (state, action) => {
      state.hasPaid = action.payload;
    },
  },
});

export const { setPlayers, setHasSignedUp, setHasPaid } = signupSlice.actions;

export default signupSlice.reducer;
