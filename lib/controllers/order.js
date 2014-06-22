'use strict';

var mongoose = require('mongoose'),
    tokenIssuer = require('../config/tokenIssuer'),
    Order = mongoose.model('Order'),
    CourierOrder = mongoose.model('courierOrder'),
    Repeat = require('repeat'),
    courierService = require('../services/courierService');

exports.getOrders = function(req, res) {
  return Order.find({_user: tokenIssuer.getUserId(req.query.access_token)}).populate('_packages _status').exec(function (err, order) {
    if(!err){
      return res.json(order);
    } else {
      return res.send(err);
    }
  });
};

exports.getById = function(req, res) {
  var id = req.params.id;
  return Order.findById(id).populate('_packages _status').exec(function(err, route) {
    if(!err){
      return res.json(route);
    } else {
      return res.send(err);
    }
  });
};

exports.create = function(req, res) {
  var order = new Order(req.body);
  courierService.assignCourier(order, function(error, order){
    if(error) return res.send(400, error);
    else{
    var saveOrder = new Order(order);
    var saveCourierOrder = new CourierOrder({_courier: order._courier, _order: order._id});
    return saveOrder.save(function(err) {
      if(err) return res.send(400, err);
      else {
        return saveCourierOrder.save(function(err){
          if(err) return res.send(400, err);
          else
            return res.send(201);
        });
      }
    });
    }
  });
};

function checkNullCourierOrders(){
  console.log('repeating task started');
  CourierOrder.find({_courier: {$exists: false}}, function(err, courierOrders){
    console.log('number of unassigned courierOrders: '+ courierOrders.length);
    if(err) console.log(err);
    else{
      if (courierOrders.length !== 0 ){
        courierOrders.forEach(function(item, index){
          Order.findById(item._order, function(err, order){
            courierService.assignCourier(order, function(error, order){
              if(error !== null) return console.log('oeps er is iets foutgegaan');
              else{
                console.log(order);
                CourierOrder.findByIdAndUpdate(item._id, {_order: order._id, _courier: order._courier}, function(err){
                  if(err) console.log(err);
                  else console.log('courierOrder Updated');
                });
              }
            });
          });
        });
      } else
        console.log('no open orders');
    }
  });
}

new Repeat(checkNullCourierOrders).every(1, 'minutes').start.in(5, 'sec');
