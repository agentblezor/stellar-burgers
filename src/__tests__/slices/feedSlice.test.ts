import feedReducer, {
  initialState,
  fetchFeeds
} from '../../services/slices/feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    status: 'pending',
    name: 'Спейс бургер',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    number: 12346,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  }
];

const mockFeedsData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockFeedsData
    };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeeds.rejected with payload', () => {
    const errorMessage = 'Ошибка загрузки ленты заказов';
    const action = {
      type: fetchFeeds.rejected.type,
      payload: errorMessage
    };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  it('should handle fetchFeeds.rejected without payload', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Network error' }
    };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
    expect(state.orders).toEqual([]);
  });

  it('should handle fetchFeeds.rejected with default error', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: {}
    };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты заказов');
    expect(state.orders).toEqual([]);
  });
});

