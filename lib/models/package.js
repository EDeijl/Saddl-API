'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PackageSchema = new Schema({
  length: Number,
  width: Number,
  height: Number,
  weight: Number
});


PackageSchema.path('length').validate(function (num) {
  return num > 0;
}, 'length must be greater than 0');

PackageSchema.path('width').validate(function (num) {
  return num > 0;
}, 'width must be greater than 0');

PackageSchema.path('height').validate(function (num) {
  return num > 0;
}, 'height must be greater than 0');

PackageSchema.path('weight').validate(function (num) {
  return num > 0;
}, 'weight must be greater than 0');

mongoose.model('Package', PackageSchema);
