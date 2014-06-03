'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RouteSchema = new Schema({
  route: [String]
});

mongoose.model('Route', RouteSchema);
