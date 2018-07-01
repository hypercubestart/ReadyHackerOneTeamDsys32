'use strict';

import axios from 'axios';

const BASE_URL = "http://10.0.99.62:3001";
// const BASE_URL = "https://bonnie-api.dsys32.com";

exports.getItems = axios({
  method: 'get',
  url: BASE_URL + '/item/get',
  withCredentials: true
});
