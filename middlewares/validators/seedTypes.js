const mongoose = require('mongoose');
const validator = require('validator');
const { vegetable } = require('../../models');

exports.createOrUpdateSeedTypeValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.vegetable)) {
      errorMessages.push('ID Sayur tidak valid!');
    }

    if (!req.body.name) {
      errorMessages.push('Nama wajib diisi!');
    }

    if (!validator.isNumeric(req.body.price)) {
      errorMessages.push('Harga wajib diisi!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const data = await vegetable.findOne({ _id: req.body.vegetable });

    if (!data) {
      return next({ message: 'Sayur tidak ditemukan', statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
