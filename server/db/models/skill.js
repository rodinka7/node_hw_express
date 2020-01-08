const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  concerts: {
    type: Number,
    required: true,
    min: 1
  },
  cities: {
    type: Number,
    required: true,
    min: 1
  },
  years: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  }
});

module.exports = mongoose.model('skill', skillSchema);