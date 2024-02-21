import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signupSlice';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
  },
});
