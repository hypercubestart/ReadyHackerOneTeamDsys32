'use strict';

// dependencies
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const busboy = require('express-busboy');
const routes = require('./routes');
const app = express();
const schemas = require('./schemas');
const auth = require('./auth');
const Staff = schemas.Staff;
const cors = require('cors');
const port = 3000;
const defaultStaffPass = 'admin';


// mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:' + process.env.DB_PASSWORD + '@recordbookcluster0-shard-00-00-l24me.mongodb.net:27017,recordbookcluster0-shard-00-01-l24me.mongodb.net:27017,recordbookcluster0-shard-00-02-l24me.mongodb.net:27017/bonnie?ssl=true&replicaSet=RecordBookCluster0-shard-0&authSource=admin');
var db = mongoose.connection;

db.once('open', async () => {
  console.log('Connected to MongoDB!');

  var staff = await Staff.find({}).exec();

  // no staff, create root
  if (staff.length === 0) {
    auth.hash(defaultStaffPass, async (hash) => {
      try {
        var newRootStaff = new Staff({
          name: 'admin',
          email: 'admin',
          passHashed: hash
        });

        await newRootStaff.save();
        console.log('created new root staff');
      } catch (err) {
        console.log('error creating root staff: ');
        console.log(err);
      }
    });
  } else if (staff.length > 1) { // other staff created, remove root
    try {
      await Staff.deleteOne({
        name: 'admin',
        email: 'admin'
      }).exec();
      console.log('deleted root staff');
    } catch (err) {
      console.log('error deleting root staff: ');
      console.log(err);
    }
  }
});

// session handling
app.set('trust proxy', 1);

const sessionMiddleware = session({
  name: 'session_id',
  secret: 'qQBQMH9jDUGVKwrPunWAquGMK4P87NGhZ3Sjk5tz8Uf8UP5tQC9rKMCc9mYErmRY',
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    httpOnly: true,
    maxAge: 253402300000000,
    sameSite: false,
    path: '/',
    secure: false
  },
  rolling: true,
  unset: 'destroy'
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "dsys32.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

busboy.extend(app, {
  upload: true
});

routes(app);



app.listen(port, () => {
  console.log('Bonnie API live on port ' + port);
});