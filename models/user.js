const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  socialId: {
    type: String,
  },
  favourites: [
    {
      title: {
        type: String,
      },
      genre: {
        type: String,
      },
      released: {
        type: Date,
      },
      runtime: {
        type: String,
      },
      imdbRating: {
        type: String,
      },
      plot: {
        type: String,
      },
      poster: {
        type: String,
      },
      country: {
        type: String,
      },
      imdbID: {
        type: String,
      },
      year: {
        type: String,
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('users', userSchema);
