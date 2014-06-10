'use strict';

var mongoose = require('mongoose'),
    tokenIssuer = require('../config/tokenIssuer'),
    Order = mongoose.model('Order'),
    courierService = require('../services/courierService');

exports.getOrders = function(req, res) {
  return Order.find({_user: tokenIssuer.getUserId(req.query.access_token)}).populate('_packages _courier').exec(function (err, order) {
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
  var order = new Order(req.body);
  courierService.assignCourier(order, function(order){
    var saveOrder = new Order(order);
    saveOrder.save(function(err) {
      if(err) return res.send(400, err);
      else return res.send(201);
    });
  });
};
