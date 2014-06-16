'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    
var courierOrderSchema = new Schema({
    _courier: {type: Schema.Types.ObjectId, ref: 'Courier'},
    _order: {type: Schema.Types.ObjectId, ref: 'Order'}
});

mongoose.model('courierOrder', courierOrderSchema);