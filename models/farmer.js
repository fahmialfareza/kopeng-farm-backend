const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  // For column
  {
    id_number: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
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
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
farmerSchema.virtual('landAreas', {
  ref: 'landArea',
  localField: '_id',
  foreignField: 'farmer',
  justOne: false,
});

module.exports = mongoose.model('farmer', farmerSchema); // Export
