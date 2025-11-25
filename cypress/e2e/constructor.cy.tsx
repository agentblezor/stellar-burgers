// Константы для селекторов, которые повторяются более 2 раз
const SELECTORS = {
  BUN_NAME: 'Краторная булка N-200i',
  MAIN_INGREDIENT_NAME: 'Биокотлета из марсианской Магнолии',
  SAUCE_NAME: 'Соус Spicy-X',
  INGREDIENT_DETAILS_TITLE: 'Детали ингредиента',
  MODAL_CONTAINER: '#modals',
  MODAL_CLOSE_BUTTON: 'button[type="button"]',
  ADD_BUTTON_TEXT: 'Добавить',
  CREATE_ORDER_BUTTON: 'Оформить заказ',
  BUN_LINK: 'a[href*="/ingredients/643d69a5c3f7b9001cfa093c"]',
  MAIN_INGREDIENT_LINK: 'a[href*="/ingredients/643d69a5c3f7b9001cfa0941"]'
};

describe('Constructor Page', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Перехватываем запрос на получение данных пользователя
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    // Устанавливаем токены авторизации
    cy.setAuthTokens();

    // Переходим на страницу конструктора
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should load ingredients', () => {
    // Проверяем, что ингредиенты загрузились
    cy.contains(SELECTORS.BUN_NAME).should('be.visible');
    cy.contains(SELECTORS.MAIN_INGREDIENT_NAME).should('be.visible');
  });

  it('should add bun to constructor', () => {
    // Находим булку и добавляем её
    cy.contains(SELECTORS.BUN_NAME).should('be.visible');
    cy.contains(SELECTORS.BUN_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Проверяем, что булка добавилась в конструктор (верх и низ)
    cy.contains(`${SELECTORS.BUN_NAME} (верх)`).should('be.visible');
    cy.contains(`${SELECTORS.BUN_NAME} (низ)`).should('be.visible');
  });

  it('should add main ingredient to constructor', () => {
    // Добавляем булку
    cy.contains(SELECTORS.BUN_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Добавляем начинку
    cy.contains(SELECTORS.MAIN_INGREDIENT_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Проверяем, что начинка добавилась
    cy.contains(SELECTORS.MAIN_INGREDIENT_NAME).should('be.visible');
  });

  it('should add sauce to constructor', () => {
    // Добавляем булку
    cy.contains(SELECTORS.BUN_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Добавляем соус
    cy.contains(SELECTORS.SAUCE_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Проверяем, что соус добавился
    cy.contains(SELECTORS.SAUCE_NAME).should('be.visible');
  });

  it('should open ingredient modal on click', () => {
    // Кликаем на ингредиент (это Link, который переходит на /ingredients/:id)
    // Ищем ссылку по href или кликаем на элемент, который содержит текст
    cy.get(SELECTORS.BUN_LINK).first().click();

    // Ждем, пока URL изменится
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    
    // Ждем загрузки данных ингредиента и появления модального окна
    // Модальное окно рендерится через React Portal в #modals
    cy.contains(SELECTORS.INGREDIENT_DETAILS_TITLE, { timeout: 5000 }).should('be.visible');
    cy.contains(SELECTORS.BUN_NAME).should('be.visible');
  });

  it('should display correct ingredient data in modal', () => {
    // Кликаем на ингредиент "Биокотлета из марсианской Магнолии"
    cy.get(SELECTORS.MAIN_INGREDIENT_LINK).first().click();

    // Ждем, пока URL изменится
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa0941');
    
    // Ждем загрузки данных ингредиента
    cy.contains(SELECTORS.MAIN_INGREDIENT_NAME, { timeout: 5000 }).should('be.visible');
    
    // Проверяем, что модальное окно открылось с правильными данными
    cy.contains(SELECTORS.INGREDIENT_DETAILS_TITLE).should('be.visible');
    // Проверяем детали ингредиента
    cy.contains('4242').should('be.visible'); // калории
    cy.contains('420').should('be.visible'); // белки
    cy.contains('142').should('be.visible'); // жиры
    cy.contains('242').should('be.visible'); // углеводы
  });

  it('should close ingredient modal on close button click', () => {
    // Открываем модальное окно
    cy.get(SELECTORS.BUN_LINK).first().click();
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    cy.contains(SELECTORS.BUN_NAME, { timeout: 5000 }).should('be.visible');
    cy.contains(SELECTORS.INGREDIENT_DETAILS_TITLE).should('be.visible');

    // Закрываем модальное окно по клику на крестик
    // Ищем кнопку закрытия - она находится в заголовке модального окна
    // Используем поиск через структуру: заголовок -> кнопка
    cy.get(SELECTORS.MODAL_CONTAINER).within(() => {
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).first().click();
    });

    // Проверяем, что модальное окно закрылось (возвращаемся на главную страницу)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains(SELECTORS.INGREDIENT_DETAILS_TITLE).should('not.exist');
  });

  it('should close ingredient modal on overlay click', () => {
    // Открываем модальное окно
    cy.get(SELECTORS.BUN_LINK).first().click();
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    cy.contains(SELECTORS.BUN_NAME, { timeout: 5000 }).should('be.visible');
    cy.contains(SELECTORS.INGREDIENT_DETAILS_TITLE).should('be.visible');

    // Закрываем модальное окно по клику на оверлей
    // Оверлей находится в #modals, кликаем на него
    cy.get(SELECTORS.MODAL_CONTAINER).within(() => {
      // Оверлей - это первый div после модального окна
      cy.get('div').last().click({ force: true });
    });

    // Проверяем, что модальное окно закрылось (возвращаемся на главную страницу)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains(SELECTORS.INGREDIENT_DETAILS_TITLE).should('not.exist');
  });

  it('should create order', () => {
    // Добавляем булку
    cy.contains(SELECTORS.BUN_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Добавляем начинку
    cy.contains(SELECTORS.MAIN_INGREDIENT_NAME)
      .parent()
      .find('button')
      .contains(SELECTORS.ADD_BUTTON_TEXT)
      .click();

    // Нажимаем кнопку "Оформить заказ"
    cy.contains(SELECTORS.CREATE_ORDER_BUTTON).click();

    // Ждем запроса на создание заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно открылось
    // Ищем модальное окно по содержимому или по селектору
    cy.contains('12345', { timeout: 10000 }).should('be.visible');
    
    // Также проверяем текст "идентификатор заказа"
    cy.contains('идентификатор заказа').should('be.visible');

    // Закрываем модальное окно - ищем кнопку закрытия в #modals
    cy.get(SELECTORS.MODAL_CONTAINER).within(() => {
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).first().click();
    });

    // Проверяем, что модальное окно закрылось
    cy.contains('12345').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });

  afterEach(() => {
    // Очищаем токены после каждого теста
    cy.clearAuthTokens();
  });
});

