let logoutButton = new LogoutButton();

// --- Выход из личного кабинета ---
function checkResponse(response) {
    if (response.success === true) {
        location.reload(); // обновить страницу в случае успеха запроса 
    }
    else {
        console.log(response);
        userForm.setLoginErrorMessage(response.error);
    }
}

logoutButton.action = () => {
        ApiConnector.logout(response => checkResponse(response));
       
};

// --- Получение информации о пользователе ---
//Выполните запрос на получение текущего пользователя (current), в колбеке которого проверьте ответ: если ответ успешный, 
//то вызовите метод отображения данных профиля (ProfileWidget.showProfile) в который передавайте данные ответа от сервера.
ApiConnector.current(response => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data); // вызов метода отображения данных профиля, в который передаваем данные ответа от сервера
    }
});

//--- Получение текущих курсов валюты ---
// Создайте объект типа RatesBoard.
// Напишите функцию, которая будет выполнять запрос получения курсов валют.
// В случае успешного запроса, очищайте таблицу с данными (clearTable) и заполняйте её (fillTable) полученными данными.
// Вызовите данную функцию для получения текущих валют.
// Напишите интервал, который будет многократно выполняться (раз в минуту) и вызывать вашу функцию с получением валют.

let ratesBoard = new RatesBoard();
function getRates(response) {
    if (response.success === true) {
        console.log("ntrt");
        ratesBoard.clearTable(); // очищайте таблицу с данными
        ratesBoard.fillTable(response.data); // заполнять таблицу полученными данными
    }
}

const repeatAtInterval = () => ApiConnector.getStocks(response => getRates(response));
repeatAtInterval();
setInterval(repeatAtInterval, 60000);

//--- Операции с деньгами ---
// - Создайте объект типа MoneyManager
let moneyManager = new MoneyManager();

// - Реализуйте пополнение баланса:
// Запишите в свойство addMoneyCallback функцию, которая будет выполнять запрос.
// Внутри функции выполните запрос на пополнение баланса (addMoney).
// Используйте аргумент функции свойства addMoneyCallback для передачи данных data в запрос.
// После выполнения запроса выполните проверку успешности запроса.
// В случае успешного запроса отобразите в профиле новые данные о пользователе из данных ответа от сервера (showProfile).
// Также выведите сообщение об успехе или ошибку (причину неудачного действия) пополнении баланса в окне отображения сообщения (setMessage).
moneyManager.addMoneyCallback = (data) => {
    // addMoney({ currency, amount }, callback)
    ApiConnector.addMoney({currency: data.currency, amount: data.amount}, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data); // отобразить в профиле новые данные о пользователе из данных ответа от сервера
            moneyManager.setMessage(response.success, "Валюта успешно добавлена");
            // setMessage(isSuccess, message)
        }
        else {
            console.log(response);
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

// - Реализуйте конвертирование валюты:
// Запишите в свойство conversionMoneyCallback функцию, которая будет выполнять запрос.
// Внутри функции выполните запрос на пополнение баланса (convertMoney)
// Используйте аргумент функции свойства conversionMoneyCallback для передачи данных в запрос.
// Повторите пункты 2.4-2.7
  // convertMoney({ fromCurrency, targetCurrency, fromAmount }, callback)
  moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney({fromCurrency: data.fromCurrency, targetCurrency: data.targetCurrency, fromAmount: data.fromAmount}, response => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data); // отобразить в профиле новые данные о пользователе из данных ответа от сервера
        moneyManager.setMessage(response.success, "Конвертация прошла успешно");
    }
    else {
        console.log(response);
        moneyManager.setMessage(response.success, response.error);
    }
});
}

// - Реализуйте перевод валюты:
// Запишите в свойство sendMoneyCallback функцию, которая будет выполнять запрос.
// Внутри функции выполните запрос на пополнение баланса (transferMoney).
// Используйте аргумент функции свойства sendMoneyCallback для передачи данных в запрос.
// Повторите пункты 2.4-2.7
 // transferMoney({ to, currency, amount }, callback)
 moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney({to: data.to, currency: data.currency, amount: data.amount}, response => {
      if (response.success === true) {
          ProfileWidget.showProfile(response.data); // отобразить в профиле новые данные о пользователе из данных ответа от сервера
          moneyManager.setMessage(response.success, "Перевод средств прошло успешно");
      }
      else {
          console.log(response);
          moneyManager.setMessage(response.success, response.error);
      }
  });
  }

// --- Работа с избранным ---
// - Создайте объект типа FavoritesWidget
let favoritesWidget = new FavoritesWidget();

// - Запросите начальный список избранного:
// Выполните запрос на получение списка избранного (getFavorites).
// В колбеке запроса проверяйте успешность запроса.
// При успешном запросе очистите текущий список избранного (clearTable).
// Отрисуйте полученные данные (fillTable).
// Заполните выпадающий список для перевода денег (updateUsersList).
function checkFavorites(response) {
    if (response.success === true) {
        favoritesWidget.clearTable(); // очищайте таблицу с данными
        favoritesWidget.fillTable(response.data); // заполнять таблицу полученными данными
        moneyManager.updateUsersList(response.data); // Заполните выпадающий список для перевода денег (updateUsersList).
    }
}

ApiConnector.getFavorites(response => checkFavorites(response));

// - Реализуйте добавления пользователя в список избранных:
// Запишите в свойство addUserCallback функцию, которая будет выполнять запрос.
// Внутри функции выполните запрос на добавление пользователя (addUserToFavorites).
// Используйте аргумент функции свойства addUserCallback для передачи данных пользователя в запрос.
// После выполнения запроса выполните проверку успешности запроса.
// В случае успеха запроса выполните пункты 2.3-2.5
// Также выведите сообщение об успехе или ошибку (причину неудачного действия) добавлении пользователя в окне отображения сообщения (setMessage).
favoritesWidget.addUserCallback = (data) => {
ApiConnector.addUserToFavorites({id: data.id, name: data.name}, response => {
    if (response.success === true) {
        favoritesWidget.clearTable(); // очищайте таблицу с данными
        favoritesWidget.fillTable(response.data); // заполнять таблицу полученными данными
        moneyManager.updateUsersList(response.data); // Заполните выпадающий список для перевода денег (updateUsersList).
        favoritesWidget.setMessage(response.success, "Пользователь добавлен успешно");
    }
    else {
        console.log(response);
        //favoritesWidget.setMessage(response.error, "Пользователя добавить не удалось - не все поля заполнены");
        favoritesWidget.setMessage(response.success, response.error);
    }
});
}

// - Реализуйте удаление пользователя из избранного
// Запишите в свойство removeUserCallback функцию, которая будет выполнять запрос.
// Внутри функции выполните запрос на удаление пользователя (removeUserFromFavorites).
// Используйте аргумент функции свойства removeUserCallback для передачи данных пользователя в запрос.
// После запроса выполните пункты 3.4-3.6
favoritesWidget.removeUserCallback = (data) => {
ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success === true) {
        favoritesWidget.clearTable(); // очищайте таблицу с данными
        favoritesWidget.fillTable(response.data); // заполнять таблицу полученными данными
        moneyManager.updateUsersList(response.data); // Заполните выпадающий список для перевода денег (updateUsersList).
        favoritesWidget.setMessage(response.success, "Пользователь удален");
    }
    else {
        console.log(response);
        favoritesWidget.setMessage(response.success, response.error);
    }
});
}