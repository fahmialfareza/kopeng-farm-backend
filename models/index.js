require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
}); // Config environment
const mongoose = require('mongoose');

// Connect express to MongoDB with mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error(err));

exports.farmer = require('./farmer');
exports.landArea = require('./landArea');
exports.plant = require('./plant');
exports.seedType = require('./seedType');
exports.user = require('./user');
exports.vegetable = require('./vegetable');
