import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import feedsReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import constructorReducer from './slices/constructorSlice'; // как у тебя называется

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  order: orderReducer,
  user: userReducer,
  burgerConstructor: constructorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
