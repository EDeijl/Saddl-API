'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransportTypeSchema = new Schema({
  name: String
});

TransportTypeSchema.path('name').validate(function (String) {
  return String;
});

mongoose.model('TransportType', TransportTypeSchema);
