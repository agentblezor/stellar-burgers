import orderReducer, {
  initialState,
  createOrder,
  clearOrder
} from '../../services/slices/orderSlice';
import { TOrder } from '@utils-types';
import { TIngredient } from '@utils-types';
import { TConstructorIngredient } from '@utils-types';

const mockOrder: TOrder = {
  _id: '643d69a5c3f7b9001cfa093c',
  status: 'done',
  name: 'Краторный бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
};

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

// Мокируем getState для createOrder thunk
const mockGetState = (hasBun: boolean, hasIngredients: boolean) => () => ({
  burgerConstructor: {
    bun: hasBun ? mockBun : null,
    ingredients: hasIngredients
      ? ([
          {
            ...mockMain,
            id: `${mockMain._id}-123`
          }
        ] as TConstructorIngredient[])
      : []
  }
});

describe('orderSlice', () => {
  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('should handle createOrder.rejected with payload', () => {
    const errorMessage = 'Ошибка создания заказа';
    const action = {
      type: createOrder.rejected.type,
      payload: errorMessage
    };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.order).toBeNull();
  });

  it('should handle createOrder.rejected without payload', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Network error' }
    };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
    expect(state.order).toBeNull();
  });

  it('should handle createOrder.rejected with default error', () => {
    const action = {
      type: createOrder.rejected.type,
      error: {}
    };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
    expect(state.order).toBeNull();
  });

  it('should handle clearOrder', () => {
    // Сначала устанавливаем заказ
    const fulfilledAction = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const stateWithOrder = orderReducer(initialState, fulfilledAction);
    expect(stateWithOrder.order).toEqual(mockOrder);

    // Затем очищаем
    const clearAction = clearOrder();
    const state = orderReducer(stateWithOrder, clearAction);

    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should handle clearOrder with error', () => {
    // Устанавливаем состояние с ошибкой
    const rejectedAction = {
      type: createOrder.rejected.type,
      payload: 'Ошибка'
    };
    const stateWithError = orderReducer(initialState, rejectedAction);
    expect(stateWithError.error).toBe('Ошибка');

    // Очищаем
    const clearAction = clearOrder();
    const state = orderReducer(stateWithError, clearAction);

    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });
});

