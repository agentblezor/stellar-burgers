import constructorReducer, {
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../../services/slices/constructorSlice';
import { TIngredient } from '@utils-types';

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

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructorSlice', () => {
  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle addBun', () => {
    const action = addBun(mockBun);
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  it('should handle addIngredient', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockMain._id);
    expect(state.ingredients[0].name).toBe(mockMain.name);
    expect(state.ingredients[0]).toHaveProperty('id');
    expect(state.ingredients[0].id).toContain(mockMain._id);
  });

  it('should handle removeIngredient', () => {
    // Сначала добавляем ингредиент
    const addAction = addIngredient(mockMain);
    const stateWithIngredient = constructorReducer(initialState, addAction);
    const ingredientId = stateWithIngredient.ingredients[0].id;

    // Затем удаляем его
    const removeAction = removeIngredient(ingredientId);
    const state = constructorReducer(stateWithIngredient, removeAction);

    expect(state.ingredients).toHaveLength(0);
  });

  it('should handle moveIngredient', () => {
    // Добавляем несколько ингредиентов
    const addMainAction = addIngredient(mockMain);
    const stateWithMain = constructorReducer(initialState, addMainAction);
    const mainId = stateWithMain.ingredients[0].id;

    const addSauceAction = addIngredient(mockSauce);
    const stateWithTwo = constructorReducer(stateWithMain, addSauceAction);
    const sauceId = stateWithTwo.ingredients[1].id;

    // Проверяем начальный порядок
    expect(stateWithTwo.ingredients[0].id).toBe(mainId);
    expect(stateWithTwo.ingredients[1].id).toBe(sauceId);

    // Меняем порядок: перемещаем второй элемент на первое место
    const moveAction = moveIngredient({ dragIndex: 1, hoverIndex: 0 });
    const state = constructorReducer(stateWithTwo, moveAction);

    // Проверяем, что порядок изменился
    expect(state.ingredients[0].id).toBe(sauceId);
    expect(state.ingredients[1].id).toBe(mainId);
  });

  it('should handle clearConstructor', () => {
    // Добавляем булку и ингредиенты
    const addBunAction = addBun(mockBun);
    const stateWithBun = constructorReducer(initialState, addBunAction);

    const addMainAction = addIngredient(mockMain);
    const stateWithIngredients = constructorReducer(stateWithBun, addMainAction);

    // Очищаем конструктор
    const clearAction = clearConstructor();
    const state = constructorReducer(stateWithIngredients, clearAction);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});

