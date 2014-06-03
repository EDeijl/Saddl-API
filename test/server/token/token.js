'use strict';

var should = require('should'),
    app = require('../../../server'),
    tokenIssuer = require('../../../lib/config/tokenIssuer'),
    mongoose = require('mongoose');

describe('tokenIssuer', function(){
  var user = {
      username: 'test',
      _id: new mongoose.Types.ObjectId(),
      email: 'test@test.com'
    };
  var token;
  it('should encode user objects', function() {
        token = tokenIssuer.getToken(user._id);
        token.should.exist;
  });
  it('should decode tokens correctly', function(){
    tokenIssuer.getUserId(token).should.exist;
  })
})
