let logoutButton = new LogoutButton();

function checkResponse(response) {
    if (response.success) {
        location.reload(); 
    }
    else {
        userForm.setLoginErrorMessage(response.error);
    }
}

logoutButton.action = () => {
        ApiConnector.logout(response => checkResponse(response)); 
};

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data); 
    }
});

let ratesBoard = new RatesBoard();
function getRates(response) {
    if (response.success) {
        ratesBoard.clearTable(); 
        ratesBoard.fillTable(response.data); 
    }
}

const repeatAtInterval = () => ApiConnector.getStocks(response => getRates(response));
repeatAtInterval();
setInterval(repeatAtInterval, 60000);

let moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Валюта успешно добавлена");
        }
        else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

  moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, "Конвертация прошла успешно");
    }
    else {
        moneyManager.setMessage(response.success, response.error);
    }
});
}

 moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
      if (response.success) {
          ProfileWidget.showProfile(response.data); 
          moneyManager.setMessage(response.success, "Перевод средств прошло успешно");
      }
      else {
          moneyManager.setMessage(response.success, response.error);
      }
  });
  }

let favoritesWidget = new FavoritesWidget();

function checkFavorites(response) {
    if (response.success) {
        favoritesWidget.clearTable(); 
        favoritesWidget.fillTable(response.data); 
        moneyManager.updateUsersList(response.data); 
    }
}

ApiConnector.getFavorites(response => checkFavorites(response));

favoritesWidget.addUserCallback = (data) => {
ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
        favoritesWidget.clearTable(); 
        favoritesWidget.fillTable(response.data); 
        moneyManager.updateUsersList(response.data); 
        favoritesWidget.setMessage(response.success, "Пользователь добавлен успешно");
    }
    else {
        favoritesWidget.setMessage(response.success, response.error);
    }
});
}

favoritesWidget.removeUserCallback = (data) => {
ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
        favoritesWidget.clearTable(); 
        favoritesWidget.fillTable(response.data); 
        moneyManager.updateUsersList(response.data); 
        favoritesWidget.setMessage(response.success, "Пользователь удален");
    }
    else {
        favoritesWidget.setMessage(response.success, response.error);
    }
});
}

