import { rootReducer } from '../services/rootReducer';

describe('rootReducer', () => {
  it('should return correct initial state when called with undefined state and unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('burgerConstructor');
  });

  it('should have correct initial state for burgerConstructor', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('should have correct initial state for ingredients', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });
});

