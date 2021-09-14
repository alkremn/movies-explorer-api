const { Schema, model } = require('mongoose');
const validator = require('validator');

const movieSchema = new Schema({
  movieId: {
    type: Number,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nameRU: {
    type: String,
  },
  nameEN: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
  director: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
});

module.exports = model('Movie', movieSchema);
