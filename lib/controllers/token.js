'use strict';

var mongoose = require('mongoose'),
    jwtIssuer = require('../config/tokenIssuer'),
    passport = require('passport'),
    User = mongoose.model('User');

exports.getToken = function(req, res, next) {
 passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);

    req.logIn(user, function(err) {
      if (err) return res.send(err);
      var token = jwtIssuer.getToken(user.email, user.hashedPassword);
      user.update({token: token}, function(){
        res.json({token: token});
      });
    });
  })(req, res, next);
 
};
