'use strict';

var mongoose = require('mongoose'),
    tokenIssuer = require('../config/tokenIssuer'),
    Message = mongoose.model('Message');

exports.getAll = function(req, res){
  Message.find(function(err, messages){
    if(!err) return res.json(messages);
    else return res.send(err);
  });
};

exports.getByCourier = function(req, res){
  Message.find({_sender: req.params.courier},function(err, message){
    if(!err) return res.json(message);
    else return res.send(err);
  });
};

exports.createMessage = function(req, res){
  var message = new Message(req.body);
  message.save(function(err){
    if(err) return res.send(400, err);
    else return res.send(201);
  });
};
