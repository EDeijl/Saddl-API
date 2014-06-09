'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  origin: String,
  destination: String,
  _packages: [{type: Schema.Types.ObjectId, ref: 'Package'}],
  _status: {type: Schema.Types.ObjectId, ref: 'OrderStatus'},
  _courier: {type: Schema.Types.ObjectId, ref: 'Courier'}
});

mongoose.model('Order', OrderSchema);
