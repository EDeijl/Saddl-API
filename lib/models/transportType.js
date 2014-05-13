'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransportTypeSchema = new Schema({
  name: String
});

mongoose.model('TransportType', TransportTypeSchema);
