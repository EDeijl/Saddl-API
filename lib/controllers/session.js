'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);

    req.logIn(user, function(err) {
      
      if (err) return res.send(err);
      res.json(req.user.userInfo);
    });
  })(req, res, next);
};

exports.loginOAuth = function(req, res, next) {
  passport.use('token', newTokenStrategy(
    function(consumerKey, done) {
      Consumer.findOne({key: consumerKey }, function(err, token) {
        if(err) {return done(err); }
        if(!token) {return done(null, false); }
        Users.findByid(token.userId, function(err, user) {
          if(err) {return done(err); }
          if(!user) {return done(null, false); }
          //fourth argument is optional info. typically used to pass
          //details needed to authorize the request (ex: 'scope')
          return done(null, user, token.secret, {scope: token.scope });
        });
      });
    },
    function(timestamp, nonce, done) {
    //validate the timestamp and nonce as necessary
      done(null, true);
    }
  ));
}
