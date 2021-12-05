const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'merchant',
    },
    production: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    debt: {
      type: Number,
      required: true,
    },
    netAmount: {
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

module.exports = mongoose.model('harvest', harvestSchema); // Export
