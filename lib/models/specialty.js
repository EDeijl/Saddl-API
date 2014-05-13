'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpecialtySchema = new Schema({
  name: String
});

mongoose.model('Specialty', SpecialtySchema);
