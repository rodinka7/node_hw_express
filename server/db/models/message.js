const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 200
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100
  },
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 300
  }
});

module.exports = mongoose.model('message', messageSchema);