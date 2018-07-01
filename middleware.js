'use strict';

// dependencies
const schemas = require('./schemas');
const auth = require('./auth');

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

exports.authenticate = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!VI(email, password)) res.status(400).end();

  try {
    let user = await User.findOne({
      email: email
    });

    if (!user) return res.status(404).end();

    auth.check(password, user.passHashed, (valid) => {
      if (valid) {
        res.locals.user = user;
        req.session.authenticated = true;
        next();
      } else res.status(401).end();
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

exports.authenticateStaff = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!VI(email, password)) res.status(400).end();

  try {
    let staff = await Staff.findOne({
      email: email
    });

    if (!staff) return res.status(404).end();

    auth.check(password, staff.passHashed, (valid) => {
      if (valid) {
        res.locals.user = staff;
        req.session.authenticated = true;
        next();
      } else res.status(401).end();
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

exports.verifySession = async (req, res, next) => {
  var id = req.session._id;

  if (!id || !req.session.authenticated) return res.status(401).end();

  try {
    let user = await User.findOne({
      _id: id
    });

    if (!user) return res.status(401).end();

    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

exports.verifyStaffSession = async (req, res, next) => {
  var id = req.session._id;

  console.log(id);
  if (!id || !req.session.authenticated) return res.status(401).end();

  try {
    let user = await Staff.findOne({
      _id: id
    });

    if (!user) return res.status(401).end();

    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}