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

exports.getById = function(req, res) {
  var id = req.params.id;
  return Route.findById(id, function(err, route) {
    if(!err){
      return res.json(route);
    } else {
      return res.send(err);
    }
  });
};

exports.create = function(req, res) {
  var newRoute = new Route(req.body);
  newRoute.save(function(err) {
    if(err) return res.send(400, err);
    else return res.send(201);
  });
};
