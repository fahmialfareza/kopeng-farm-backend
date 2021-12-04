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

const merchantSchema = new mongoose.Schema(
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
    plantDate: {
      type: Date,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    harvestsEstimation: {
      type: [harvestSchema],
      required: true,
    },
    productionEstimation: {
      type: Number,
      required: true,
    },
    priceEstimation: {
      type: Number,
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

module.exports = mongoose.model('merchant', merchantSchema); // Export
