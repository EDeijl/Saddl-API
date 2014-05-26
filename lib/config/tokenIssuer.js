var jwt = require('jwt-simple');

exports.getToken = function(payload, secret){
  return jwt.encode(payload, secret);
};
