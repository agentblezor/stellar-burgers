import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TConstructorIngredient } from '@utils-types';
import { orderBurgerApi } from '@api';
import type { RootState } from '../rootReducer';
import { clearConstructor } from './constructorSlice';

export type TOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  order: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; rejectValue: string }
>('order/create', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState();
  const { bun, ingredients } = state.burgerConstructor;

  if (!bun) return rejectWithValue('Необходимо выбрать булку');
  if (!ingredients || ingredients.length === 0)
    return rejectWithValue('Добавьте ингредиенты');

  const ingredientsIds = [
    bun._id,
    ...ingredients.map((i: TConstructorIngredient) => i._id),
    bun._id
  ];
  try {
    const data = await orderBurgerApi(ingredientsIds);
    dispatch(clearConstructor());
    return data.order;
  } catch (e) {
    return rejectWithValue(
      (e as { message?: string })?.message || 'Ошибка создания заказа'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.order = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка создания заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
