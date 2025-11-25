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
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
  });

  it('should add bun to constructor', () => {
    // Находим булку и добавляем её
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что булка добавилась в конструктор (верх и низ)
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('should add main ingredient to constructor', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что начинка добавилась
    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
  });

  it('should add sauce to constructor', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем соус
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что соус добавился
    cy.contains('Соус Spicy-X').should('be.visible');
  });

  it('should open ingredient modal on click', () => {
    // Кликаем на ингредиент (это Link, который переходит на /ingredients/:id)
    // Ищем ссылку по href или кликаем на элемент, который содержит текст
    cy.get('a[href*="/ingredients/643d69a5c3f7b9001cfa093c"]').first().click();

    // Ждем, пока URL изменится
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    
    // Ждем загрузки данных ингредиента и появления модального окна
    // Модальное окно рендерится через React Portal в #modals
    cy.contains('Детали ингредиента', { timeout: 5000 }).should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
  });

  it('should display correct ingredient data in modal', () => {
    // Кликаем на ингредиент "Биокотлета из марсианской Магнолии"
    cy.get('a[href*="/ingredients/643d69a5c3f7b9001cfa0941"]').first().click();

    // Ждем, пока URL изменится
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa0941');
    
    // Ждем загрузки данных ингредиента
    cy.contains('Биокотлета из марсианской Магнолии', { timeout: 5000 }).should('be.visible');
    
    // Проверяем, что модальное окно открылось с правильными данными
    cy.contains('Детали ингредиента').should('be.visible');
    // Проверяем детали ингредиента
    cy.contains('4242').should('be.visible'); // калории
    cy.contains('420').should('be.visible'); // белки
    cy.contains('142').should('be.visible'); // жиры
    cy.contains('242').should('be.visible'); // углеводы
  });

  it('should close ingredient modal on close button click', () => {
    // Открываем модальное окно
    cy.get('a[href*="/ingredients/643d69a5c3f7b9001cfa093c"]').first().click();
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    cy.contains('Краторная булка N-200i', { timeout: 5000 }).should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');

    // Закрываем модальное окно по клику на крестик
    // Ищем кнопку закрытия - она находится в заголовке модального окна
    // Используем поиск через структуру: заголовок -> кнопка
    cy.get('#modals').within(() => {
      cy.get('button[type="button"]').first().click();
    });

    // Проверяем, что модальное окно закрылось (возвращаемся на главную страницу)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('should close ingredient modal on overlay click', () => {
    // Открываем модальное окно
    cy.get('a[href*="/ingredients/643d69a5c3f7b9001cfa093c"]').first().click();
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    cy.contains('Краторная булка N-200i', { timeout: 5000 }).should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');

    // Закрываем модальное окно по клику на оверлей
    // Оверлей находится в #modals, кликаем на него
    cy.get('#modals').within(() => {
      // Оверлей - это первый div после модального окна
      cy.get('div').last().click({ force: true });
    });

    // Проверяем, что модальное окно закрылось (возвращаемся на главную страницу)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('should create order', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Нажимаем кнопку "Оформить заказ"
    cy.contains('Оформить заказ').click();

    // Ждем запроса на создание заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно открылось
    // Ищем модальное окно по содержимому или по селектору
    cy.contains('12345', { timeout: 10000 }).should('be.visible');
    
    // Также проверяем текст "идентификатор заказа"
    cy.contains('идентификатор заказа').should('be.visible');

    // Закрываем модальное окно - ищем кнопку закрытия в #modals
    cy.get('#modals').within(() => {
      cy.get('button[type="button"]').first().click();
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

