import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[], // успешный payload
  void, // аргумент thunk'а (ничего не передаём)
  { rejectValue: string } // тип payload'а для rejectWithValue
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string })?.message || 'Ошибка загрузки ингредиентов'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        // если использовался rejectWithValue — текст ошибки в payload
        state.error =
          action.payload ??
          action.error.message ??
          'Ошибка загрузки ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;
