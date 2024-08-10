import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPastGames, getGameById } from '../../api/gameService';
import { getSignupsForGame } from '../../api/signupService';

export const fetchPastGames = createAsyncThunk('games/fetchPastGames', async () => {
  const response = await getPastGames();
  return response;
});

export const fetchSignupsForGame = createAsyncThunk('games/fetchSignupsForGame', async (gameId) => {
  const response = await getSignupsForGame(gameId);
  return response;
});

export const fetchGameById = createAsyncThunk('games/fetchGameById', async (gameId) => {
  const response = await getGameById(gameId);
  return response;
});

const gameSlice = createSlice({
  name: 'games',
  initialState: {
    pastGames: [],
    selectedGame: null,
    selectedGameSignups: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPastGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPastGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pastGames = action.payload;
      })
      .addCase(fetchPastGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSignupsForGame.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSignupsForGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedGameSignups = action.payload;
      })
      .addCase(fetchSignupsForGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGameById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default gameSlice.reducer;