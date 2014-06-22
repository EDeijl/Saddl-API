'use strict';

var mongoose = require('mongoose'),
    Courier = mongoose.model('Courier');

exports.couriers = function(req, res){
  Courier.find(function(err, couriers) {
    if(!err){
      return res.json(couriers);
    } else {
      return res.send(err);
    }
  });
};

exports.getById = function(req, res) {
  var id = req.params.id;
  return Courier.findById(id, function(err, route) {
    if(!err){
      return res.json(route);
    } else {
      return res.send(err);
    }
  });
};

exports.setLocation = function(req, res){
  Courier.findByIdAndUpdate(req.query.id,{location: req.body}, function(err){
    if(!err) return res.send(201);
    else res.send(err);
  });
};
