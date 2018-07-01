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


export { getItems };
