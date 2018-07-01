'use strict';

const async = require('async');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  passHashed: String,
  previousOrders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  admin: Boolean
});

var ItemSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  picture: String, // url to spaces
  popularity: Number,
  category: String
});

var OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: Number
  }],
  totalPrice: Number,
  orderTime: Date,
  fulfilledTime: Date, // fullfilled and cancelledTime are both nullable
  cancelledTime: Date
});

var Item = mongoose.model('Item', ItemSchema, 'items');
var Order = mongoose.model('Order', OrderSchema, 'orders');
var User = mongoose.model('User', UserSchema, 'users');

module.exports = {
  Item: Item,
  Order: Order,
  User: User
};
