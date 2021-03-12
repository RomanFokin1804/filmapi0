const mongoose = require('mongoose');

const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('refreshTokens', refreshTokenSchema);
