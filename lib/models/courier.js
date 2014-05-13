'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourierSchema = new Schema({
  name: String,
  picture: String,
  specialties: [{type: Schema.Types.ObjectId, ref: 'Specialty'}],
  route: {type: Schema.Types.ObjectId, ref: 'Route'},
  transportation: {type: Schema.Types.ObjectId, ref: 'Transport'},
  status: {type: Schema.Types.ObjectId, ref: 'CourierStatus'},
  rating: Number
});


CourierSchema.path('rating').validate(function (num) {
  return num >= 0 && num <= 5;
}, 'rating must be between 0 and 5');

mongoose.model('Courier', CourierSchema);
