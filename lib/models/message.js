var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: String,
  body: String,
  _sender: {type: Schema.Types.ObjectId, ref: 'Courier'}
});

mongoose.model('Message', MessageSchema);
