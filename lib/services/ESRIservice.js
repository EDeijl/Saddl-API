'use strict';
var config = require('../config/config'),
    request = require('request');


exports.getToken = function(callback){
  var url = 'https://www.arcgis.com/sharing/oauth2/token?client_id='+config.argcis_id+'&grant_type=client_credentials&client_secret='+config.argcis_secret+'&f=pjson';
  var options = {
    url: url,
    headers:{
      'Content-Type': 'application/json'
    }
  };
  return request(options, function(error, response, body){
    if(!error && response.statusCode === 200)
    {
      var json = JSON.parse(body);
      callback(json.access_token);
    }
  });
};
