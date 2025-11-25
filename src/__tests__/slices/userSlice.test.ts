import userReducer, {
  initialState,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  setAuthChecked
} from '../../services/slices/userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123'
};

const mockLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

describe('userSlice', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('registerUser', () => {
    it('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle registerUser.rejected with payload', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle registerUser.rejected without payload', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Network error' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle registerUser.rejected with default error', () => {
      const action = {
        type: registerUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loginUser.rejected with payload', () => {
      const errorMessage = 'Ошибка входа';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle loginUser.rejected without payload', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Network error' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle loginUser.rejected with default error', () => {
      const action = {
        type: loginUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка входа');
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should handle getUser.pending', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should handle getUser.fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle getUser.rejected', () => {
      const action = {
        type: getUser.rejected.type,
        payload: 'Не удалось получить пользователя'
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('Не удалось получить пользователя');
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle getUser.rejected without payload', () => {
      const action = {
        type: getUser.rejected.type,
        error: { message: 'Network error' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull(); // getUser.rejected устанавливает error в null, если нет payload
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should handle updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle updateUser.fulfilled', () => {
      const updatedUser: TUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
      expect(state.error).toBeNull();
    });

    it('should handle updateUser.rejected with payload', () => {
      const errorMessage = 'Ошибка обновления данных';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle updateUser.rejected without payload', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Network error' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('should handle updateUser.rejected with default error', () => {
      const action = {
        type: updateUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка обновления данных');
    });
  });

  describe('logoutUser', () => {
    it('should handle logoutUser.fulfilled', () => {
      // Сначала устанавливаем пользователя
      const loginAction = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const stateWithUser = userReducer(initialState, loginAction);
      expect(stateWithUser.user).toEqual(mockUser);

      // Затем выходим
      const logoutAction = {
        type: logoutUser.fulfilled.type
      };
      const state = userReducer(stateWithUser, logoutAction);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle logoutUser.rejected with payload', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: logoutUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
    });

    it('should handle logoutUser.rejected without payload', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'Network error' }
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Network error');
    });

    it('should handle logoutUser.rejected with default error', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка выхода');
    });
  });

  describe('setAuthChecked', () => {
    it('should handle setAuthChecked', () => {
      const action = setAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle setAuthChecked to false', () => {
      // Сначала устанавливаем в true
      const setTrueAction = setAuthChecked(true);
      const stateWithTrue = userReducer(initialState, setTrueAction);
      expect(stateWithTrue.isAuthChecked).toBe(true);

      // Затем устанавливаем в false
      const setFalseAction = setAuthChecked(false);
      const state = userReducer(stateWithTrue, setFalseAction);

      expect(state.isAuthChecked).toBe(false);
    });
  });
});

