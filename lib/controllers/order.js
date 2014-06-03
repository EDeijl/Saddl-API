'use strict';

var mongoose = require('mongoose'),
    Order = mongoose.model('Order');

exports.getOrders = function(req, res) {
  return Order.find({}).populate('_packages _courier _user').exec(function (err, order) {
    if(!err){
      return res.json(order);
    } else {
      return res.send(err);
    }
  });
};

exports.getById = function(req, res) {
  var id = req.params.id;
  return Order.findById(id, function(err, route) {
    if(!err){
      return res.json(route);
    } else {
      return res.send(err);
    }
  });
};

exports.create = function(req, res) {
  var newOrder = new Order(req.body);
  newOrder.save(function(err) {
    if(err) return res.send(400, err);
    else return res.send(201);
  });
};
