'use strict';

var mongoose = require('mongoose'),
    Route = mongoose.model('Route');

exports.getRoutes = function(req, res) {
  return Route.find(function (err, routes) {
    if(!err){
      return res.json(routes);
    } else {
      return res.send(err);
    }
  });
};
