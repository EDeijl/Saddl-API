var jwt = require('jwt-simple');
var config = require('./config');

var secret = config.encryptionSecret;

exports.getToken = function(payload){
  return jwt.encode(payload, secret);
};

exports.getUser = function(token) {
  return jwt.decode(token, secret);
}
