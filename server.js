'use strict';

// dependencies
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:' + process.env.DB_PASSWORD + '@recordbookcluster0-shard-00-00-l24me.mongodb.net:27017,recordbookcluster0-shard-00-01-l24me.mongodb.net:27017,recordbookcluster0-shard-00-02-l24me.mongodb.net:27017/bonnie?ssl=true&replicaSet=RecordBookCluster0-shard-0&authSource=admin', {
  useMongoClient: true
});
var db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB!');
});


app.get('/', (req, res) => {
  res.send('pong!');
});

app.listen(port, () => {
  console.log('Bonnie API live on port ' + port);
});
