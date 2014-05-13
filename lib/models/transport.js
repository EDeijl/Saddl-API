'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransportSchema = new Schema({
  width: Number,
  length: Number,
  heigth: Number,
  maxWeight: Number,
  type: {type: Schema.Types.ObjectId, ref: 'TransportType'}
});


TransportSchema.path('length').validate(function (num) {
  return num > 0;
}, 'length must be greater than 0');

TransportSchema.path('width').validate(function (num) {
  return num > 0;
}, 'width must be greater than 0');

TransportSchema.path('heigth').validate(function (num) {
  return num > 0;
}, 'height must be greater than 0');

TransportSchema.path('maxWeight').validate(function (num) {
  return num > 0;
}, 'weigth must be greater than 0');

mongoose.model('Transport', TransportSchema);
