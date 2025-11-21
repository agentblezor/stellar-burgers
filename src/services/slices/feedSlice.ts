import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData, // успешный payload
  void, // аргумент thunk
  { rejectValue: string }
>('feeds/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data; // { orders, total, totalToday }
  } catch (e) {
    return rejectWithValue(
      (e as { message?: string })?.message || 'Ошибка загрузки ленты заказов'
    );
  }
});

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          'Ошибка загрузки ленты заказов';
      });
  }
});

export default feedSlice.reducer;
