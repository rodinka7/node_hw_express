const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  photo: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 200
  },
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 1
  }
});

module.exports = mongoose.model('upload', uploadSchema);