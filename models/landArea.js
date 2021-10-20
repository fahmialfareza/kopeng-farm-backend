const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
});

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
      type: coordinateSchema,
      required: false,
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
