const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Text Schema
const textSchema = new Schema({
  text: {
    type: String,
    required: true, // Ensure that text is provided
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',  // This assumes you have a User model
    required: true,
  },
  category: {
    type: String,
    required: true, // Ensure a category is provided
  },
  title: {
    type: String,
    required: true, // Ensure a category is provided
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Text model
const Text = mongoose.model('Text', textSchema);

module.exports = Text;
