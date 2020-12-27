"use strict";
let userForm = new UserForm(); // создаем объект класса UserForm

// --- обработка запроса на вход ---
userForm.loginFormCallback = (data) => {
    ApiConnector.login({login: data.login, password: data.password}, response => {
        if (response.success === true)
        {
            location.reload(); // обновить страницу в случае успеха запроса 
        }
        else
        {
            console.log(response);
            userForm.setLoginErrorMessage(response.error); // В случае провала запроса выведите ошибку в окно для ошибок
        }
    });
}

// --- обработка запроса на регистрацию ---
userForm.registerFormCallback = (data) => {
    ApiConnector.register({login: data.login, password: data.password}, response => {
        if (response.success === true)
        {
            location.reload(); // обновить страницу в случае успеха запроса 
        }
        else
        {
            console.log(response);
            userForm.setRegisterErrorMessage(response.error); // В случае провала запроса выведите ошибку в окно для ошибок
        }
    });
}



