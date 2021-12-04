const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
  name: String,
  start: {
    type: Number,
  },
  end: {
    type: Number,
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
    price: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    harvestsEstimation: {
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
