'use strict';

const auth = require('./auth');
const async = require('async');
const spaces = require('./spaces');
const schemas = require('./schemas');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

  if (!items) return res.status(400);

  var promises = items.map(function(item) {
    return new Promise(function(resolve, reject) {
      Item.findOne({_id: item._id}, function(err, itemObject) {
        if (err) {
          reject(err)
        } else {
          resolve(itemObject.price * item.quantity);
        }
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
  }).then(order => {
    // TODO: sockets to the staff
    user.previousOrders.push(order._id);

    return user.save().then(function() {
      res.status(200).json(order);
    });
  }).catch(err => {
    console.log(err)
    res.status(500).end();
  });
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
    var staffObject = new User({
      name: name,
      email: email,
      passHashed: hash,
      admin: true
    });

    try {
      await staffObject.save();
      res.status(200).end();
    } catch (err) {
      res.status(500).end();
    }
  });
}

exports.getStaff = async (req, res) => { 
  try {
    var staff = await User.find({admin: true}).exec()

    res.status(200).json(staff);
  } catch(err) {
    res.status(500).end();
  }

}

exports.fetchOrders = async (req, res) => {
  try {
    let orders = await Order.find({fulfilledTime: { $exists: false }, cancelledTime: { $exists: false }}).populate('user').populate('items').exec();

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
    let order = await Order.updateOne({_id: id}, { $set: { fulfilledTime: Date.now() }}).exec();
    let user = await User.findOne({_id: order.user}).exec()

    const msg = {
      to: user.email,
      from: 'bonnies@bonnies.com',
      subject: 'Your Order,' + order._id.toString().slice(0, 6) + ', is ready',
      text: 'Please come pickup your recent order!',
      html: '<strong>Have a wonderful 4th of July holiday!!</strong>',
    }
    sgMail.send(msg);

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
