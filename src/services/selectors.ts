import type { RootState } from './rootReducer';

export const selectIngredients = (state: RootState) =>
  state.ingredients?.ingredients || [];

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients?.isLoading || false;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients?.error || null;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectOrder = (state: RootState) => state.order?.order || null;

export const selectOrderLoading = (state: RootState) =>
  state.order?.isLoading || false;

export const selectFeeds = (state: RootState) => state.feeds?.orders || [];

export const selectFeedsLoading = (state: RootState) =>
  state.feeds?.isLoading || false;

export const selectFeedsTotal = (state: RootState) => state.feeds?.total || 0;

export const selectFeedsTotalToday = (state: RootState) =>
  state.feeds?.totalToday || 0;

export const selectOrders = (state: RootState) => state.orders?.orders || [];

export const selectUser = (state: RootState) => state.user.user;

export const selectUserLoading = (state: RootState) =>
  state.user?.isLoading || false;

export const selectUserError = (state: RootState) => state.user?.error || null;

export const selectIsAuthChecked = (state: RootState) =>
  state.user?.isAuthChecked || false;
