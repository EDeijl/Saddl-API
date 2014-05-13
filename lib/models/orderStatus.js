
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderStatusSchema = new Schema({
  status: String
});

mongoose.model('OrderStatus', OrderStatusSchema);
