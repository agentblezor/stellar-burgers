import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

export type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<
  TOrder[], // успешный payload
  void, // аргумент thunk
  { rejectValue: string } // payload для rejectWithValue
>('orders/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi(); // возвращает TOrder[]
    return data;
  } catch (e) {
    return rejectWithValue(
      (e as { message?: string })?.message || 'Ошибка загрузки заказов'
    );
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки заказов';
      });
  }
});

export default ordersSlice.reducer;
