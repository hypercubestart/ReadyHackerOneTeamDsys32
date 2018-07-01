'use strict';

const auth = require('./auth');
const async = require('async');
const spaces = require('./spaces');
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
    var promises = items.map(function(item) {
      return new Promise(function(resolve, reject) {
        Item.findOne({_id: item._id}, function(itemObject) {
          resolve(itemObject.price * item.quantity);
        })
      })
    })
    Promise.all(promises).then(function(values) {
      return values.reduce((a, b) => a + b, 0)
    }).then(totalPrice => {
      var orderObject = new Order({
        user: user._id,
        items: items,
        totalPrice: totalPrice,
        orderTime: orderTime
      });
      return orderObject.save()
    }).function(order) {
      // TODO: sockets to the staff
      res.status(200).json(order);
    });
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
    let orders = await Order.find({fulfilledTime: { $exists: false }, cancelledTime: { $exists: false }}).exec();

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
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

exports.exportOrders = async (req, res) => {
  try {
    let orders = await Order.find({}).exec();

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

exports.addItem = async (req, res) => {
  var picture = req.files.picture;

  var name = req.body.name;
  var description = req.body.description;
  var price = req.body.price;
  var category = req.body.category;

  if (!VI(name, description, price, category, picture)) return res.status(400).end();

  try {
    var url = await spaces.uploadFile(picture.file, picture.filename);

    var itemObject = new Item({
      name: name,
      description: description,
      price: price,
      picture: url,
      popularity: 0,
      category: category
    });

    let item = await itemObject.save();

    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
}

exports.removeItem = async (req, res) => {
  var id = req.body.id;

  try {
    await Item.deleteOne({_id: id}).exec();

    // TODO: remove the image from spaces

    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
}
