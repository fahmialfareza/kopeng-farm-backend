const mongoose = require('mongoose');

const seedTypeSchema = new mongoose.Schema(
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
    vegetable: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'vegetable',
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

module.exports = mongoose.model('seedType', seedTypeSchema); // Export
