'use strict';

const auth = require('./auth');
const async = require('async');
const schemas = require('./schemas');

// mongoose models
const User = schemas.User;
const Item = schemas.Item;
const Order = schemas.Order;
const Staff = schemas.Staff;

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
        res.status(200).json(req.session);
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
  
  var user = res.locals.user;
  var items = req.body.items;
  var orderTime = Date.now();
  var totalPrice = 0;

  if (!items) return res.status(400);

  try {
    items.forEach(async (item) => {
      var itemObject = await Item.findOne({_id: item.item}).exec();
  
      totalPrice += itemObject.price * item.quantity;
    });
  
    var orderObject = new Order({
      user: user._id,
      items: items,
      totalPrice: totalPrice,
      orderTime: orderTime
    });

    let order = await orderObject.save();

    // TODO: sockets to the staff
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
}

exports.fetchUser = async (req, res) => {
  var user = res.locals.user;

  res.status(200).json(user);
}

exports.registerStaff = async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  if (!VI(name, email, password)) return res.status(400).end();

  auth.hash(password, async (hash) => {
    var staffObject = new Staff({
      name: name,
      email: email,
      passHashed: hash
    });

    try {
      await staffObject.save();
      res.status(200).end();
    } catch (err) {
      res.status(500).end();
    }
  });
}

exports.fetchOrders = async (req, res) => {
  try {
    let orders = await Orders.find({fulfilledTime: undefined, cancelledTime: undefined}).exec();

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).end();
  }
}

exports.fulfillOrder = async (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  try {
    await Order.updateOne({_id: id}, { $set: { fulfilledTime: Date.now() }}).exec();

    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
}

exports.cancelOrder = async (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  try {
    await Order.updateOne({_id: id}, { $set: { cancelledTime: Date.now() }}).exec();

    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
}
