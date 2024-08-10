import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signupSlice';
import gameReducer from './slices/gameSlice';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    games: gameReducer, 
  },
});
