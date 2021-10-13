const validator = require('validator');
const mongoose = require('mongoose');
const { farmer } = require('../../models');

exports.createOrUpdateLandAreaValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.farmer)) {
      errorMessages.push('id farmer is not valid!');
    }

    if (!validator.isNumeric(req.body.area)) {
      errorMessages.push('Area must be number!');
    }

    if (req.body.coordinate && req.body.coordinate.length !== 2) {
      errorMessages.push('Coordinate is not valid!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const data = await farmer.findOne({ _id: req.body.farmer });

    if (!data) {
      errorMessages.push('Farmer is not exist');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
