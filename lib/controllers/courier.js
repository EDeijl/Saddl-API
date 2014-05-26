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
