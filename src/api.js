'use strict';

import axios from 'axios';

const BASE_URL = "http://10.0.99.62:3001";
// const BASE_URL = "https://bonnie-api.dsys32.com";

var getItems = (callback) => {
  const url = BASE_URL + '/item/get';

  axios.get(url, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var register = (name, email, password, callback) => {
  const url = BASE_URL + '/user/register';

  axios.post(url, {
    name: name,
    email: email,
    password: password
  }, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var login = (email, password, callback) => {
  const url = BASE_URL + '/user/login';

  axios.post(url, {
    email: email,
    password: password
  }, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var logout = (callback) => {
  const url = BASE_URL + '/user/logout';

  axios.post(url, {}, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var placeOrder = (items, callback) => {
  const url = BASE_URL + '/order/place';

  axios.post(url, {items: items}, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var isAuthenticated = (callback) => {
  const url = BASE_URL + '/user/authenticated';

  axios.get(url, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var getUser = (callback) => {
  const url = BASE_URL + '/user/get';

  axios.get(url, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var fulfillOrder = (id, callback) => {
  const url = BASE_URL + '/order/fulfill';

  axios.post(url, {id: id}, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

var cancelOrder = (id, callback) => {
  const url = BASE_URL + '/order/cancel';

  axios.post(url, {id: id}, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

var getOrders = (callback) => {
  const url = BASE_URL + '/order/get';

  axios.get(url, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

var exportOrders = (callback) => {
  const url = BASE_URL + '/order/export';

  axios.get(url, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

var registerStaff = (name, email, password, callback) => {
  const url = BASE_URL + '/staff/register';

  axios.post(url, {
    name: name,
    email: email,
    password: password
  }, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var loginStaff = (email, password, callback) => {
  const url = BASE_URL + '/staff/login';

  axios.post(url, { email: email, password: password }, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

var logoutStaff = (callback) => {
  const url = BASE_URL + '/staff/logout';

  axios.post(url, {}, {withCredentials: true}).then((res) => {
    callback(res);
  }).catch((err) => {
    console.log(err);
  });
}

var addItem = (name, description, price, category, picture, callback) => {
  var form = new FormData();

  form.append("name", name);
  form.append("description", description);
  form.append("price", price);
  form.append("category", category);
  form.append("picture", picture);

  axios({
    method: 'post',
    url: BASE_URL + '/item/add',
    data: form,
    config: { headers: {'Content-Type': 'multipart/form-data' }},
    withCredentials: true,

  }).then(callback);
}

var removeItem = (id, callback) => {
  const url = BASE_URL + '/item/remove';

  axios.post(url, {id: id}, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

var getStaff = (callback) => {
  const url = BASE_URL + '/staff/get';

  axios.get(url, {withCredentials: true}).then((res) => callback(res)).catch((err) => console.log(err));
}

export { getItems, register, login, logout, placeOrder, isAuthenticated, getUser, fulfillOrder, cancelOrder, getOrders, exportOrders, registerStaff, loginStaff, logoutStaff, addItem, removeItem, getStaff };
