'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  QUOTAGARDSTATIC_URL: process.env.QUOTAGARD_URL || 'http://quotaguard1383:bbb560dc4c99@proxy.quotaguard.com:9292'
};
