const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
  name: String,
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
});

const vegetableSchema = new mongoose.Schema(
  // For column
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    harvests: {
      type: [harvestSchema],
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
