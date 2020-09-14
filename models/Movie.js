const mongoose = require('mongoose');

const Movie = mongoose.Schema({
  name: {
    type: String
  },
  watched: {
    type: Boolean
  }
});

module.exports = mongoose.model('Movie', Movie);