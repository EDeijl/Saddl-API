'use strict';

var should = require('should'),
    app = require('../../../server'),
    tokenIssuer = require('../../../lib/config/tokenIssuer');

describe('tokenIssuer', function(){
  var user = {
      username: 'test',
      email: 'test@test.com'
    };
  var token;
  it('should encode user objects', function() {
        token = tokenIssuer.getToken(user);
        token.should.exist;
  });
  it('should decode tokens correctly', function(){
    tokenIssuer.getUser(token).should.exist;
  })
})
