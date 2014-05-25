var jwt = require('jwt-simple');

exports.getToken = function(payload, secret){
  console.log(payload);
  console.log(secret);
  return jwt.encode(payload, secret);
};
