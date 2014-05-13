'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourierStatusSchema = new Schema({
  status: String
});

mongoose.model('CourierStatus', CourierStatusSchema);
