'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  origin: String,
  destination: String,
  packages: [{type: Schema.Types.ObjectId, ref: 'Package'}],
  status: {type: Schema.Types.ObjectId, ref: 'OrderStatus'}
});

mongoose.model('Order', OrderSchema);
