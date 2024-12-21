const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false, // Default is a regular user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
