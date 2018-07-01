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


export { getItems, register, login };
