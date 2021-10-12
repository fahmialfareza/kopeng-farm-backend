const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema(
  // For column
  {
    name: {
      type: String,
      required: true,
    },
  },
  // Enables timestamps
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

module.exports = mongoose.model('vegetable', vegetableSchema); // Export
