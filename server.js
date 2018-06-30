'use strict';

// dependencies
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log('Bonnie API live on port ' + port);
});
