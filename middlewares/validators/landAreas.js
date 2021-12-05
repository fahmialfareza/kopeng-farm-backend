const validator = require('validator');
const mongoose = require('mongoose');
const { farmer } = require('../../models');

exports.createOrUpdateLandAreaValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.farmer)) {
      errorMessages.push('ID Petani tidak valid!');
    }

    if (!validator.isNumeric(req.body.area)) {
      errorMessages.push('Luas Area harus angka!');
    }

    if (
      req.body.coordinate &&
      (!validator.isNumeric(req.body.coordinate.lat) ||
        !validator.isNumeric(req.body.coordinate.lng))
    ) {
      errorMessages.push('Koordinat tidak valid!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const data = await farmer
      .findOne({ _id: req.body.farmer })
      .populate({ path: 'user' });

    if (!data || !data?.user) {
      errorMessages.push('Petani tidak ditemukan');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
