'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourierSchema = new Schema({
  name: String,
  picture: String,
  _specialties: [{type: Schema.Types.ObjectId, ref: 'Specialty'}],
  _route: {type: Schema.Types.ObjectId, ref: 'Route'},
  _transportation: {type: Schema.Types.ObjectId, ref: 'Transport'},
  _status: {type: Schema.Types.ObjectId, ref: 'CourierStatus'},
  rating: Number
});


CourierSchema.path('rating').validate(function (num) {
  return num >= 0 && num <= 5;
}, 'rating must be between 0 and 5');

mongoose.model('Courier', CourierSchema);
