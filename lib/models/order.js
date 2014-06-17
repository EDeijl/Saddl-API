'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  origin: String,
  destination: String,
  _packages: {type: Schema.Types.ObjectId, ref: 'Package'},
  _status: {type: Schema.Types.ObjectId, ref: 'OrderStatus'},
  _specialty: {type: Schema.Types.ObjectId, ref: 'Specialty'},
  //_courier: {type: Schema.Types.ObjectId, ref: 'Courier'},
  _user : {type: Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Order', OrderSchema);
