const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  // For column
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'farmer',
    },
    landArea: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'landArea',
    },
    seedType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'seedType',
    },
    vegetable: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'vegetable',
    },
    plantDate: {
      type: Date,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    harvestEstimation: {
      type: [Date],
      required: true,
    },
    harvest: {
      type: [Date],
      required: false,
    },
    productionEstimation: {
      type: Number,
      required: true,
    },
    production: {
      type: Number,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
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

module.exports = mongoose.model('plant', plantSchema); // Export
