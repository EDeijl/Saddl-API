'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RouteSchema = new Schema({
  orders: [{type: Schema.Types.ObjectId, ref: 'Order'}]
});

mongoose.model('Route', RouteSchema);
