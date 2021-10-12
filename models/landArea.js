const mongoose = require('mongoose');

const landAreaSchema = new mongoose.Schema(
  // For column
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'farmer',
    },
    area: {
      type: Number,
      required: true,
    },
    coordinate: {
      type: [Number],
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

module.exports = mongoose.model('landArea', landAreaSchema); // Export
