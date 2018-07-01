'use strict';

const auth = require('./auth');
const async = require('async');
const schemas = require('./schemas');

// mongoose models
const User = schemas.User;
const Item = schemas.Item;
const Order = schemas.Order;

const VI = (...parameters) => {
  for (var i = 0; i < parameters.length; i++) {
    if (!parameters[i]) return false;
  }
  return true;
}

// route controllers
exports.login = (req, res) => {
  var user = res.locals.user;
  req.session._id = user._id;
  req.session.authenticated = true;

  res.status(200).end();
}

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.register = (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  if (!VI(name, email, password)) return res.status(400).end();

  auth.hash(password, (hash) => {
    var newUser = new User({
      name: name,
      email: email,
      passHashed: hash,
      previousOrders: []
    });

    newUser.save((err, savedUser) => {
      if (err) res.status(500).end();
      else {
        req.session._id = savedUser._id;
        req.session.authenticated = true;
        res.status(200).end();
      }
    });
  });
}

exports.fetchItems = async (req, res) => {
  try {
    let items = await Item.find({}).exec();
    
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

exports.placeOrder = async (req, res) => {
  /*
  var user = res.locals.user;
  var items = req.body.items;
  var orderedDate = 
*/
}
