import ordersReducer, {
  initialState,
  fetchOrders
} from '../../services/slices/ordersSlice';
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

describe('ordersSlice', () => {
  it('should return initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchOrders.pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOrders.rejected with payload', () => {
    const errorMessage = 'Ошибка загрузки заказов';
    const action = {
      type: fetchOrders.rejected.type,
      payload: errorMessage
    };
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual([]);
  });

  it('should handle fetchOrders.rejected without payload', () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: { message: 'Network error' }
    };
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
    expect(state.orders).toEqual([]);
  });

  it('should handle fetchOrders.rejected with default error', () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: {}
    };
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
    expect(state.orders).toEqual([]);
  });
});

