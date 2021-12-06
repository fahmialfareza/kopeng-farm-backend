const mongoose = require('mongoose');
const validator = require('validator');
const { user } = require('../../models');

exports.createOrUpdateFarmerValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (
      !validator.isNumeric(req.body.id_number) ||
      req.body.id_number.length !== 16
    ) {
      errorMessages.push('NIK harus 16 digit!');
    }

    if (!req.body.name) {
      errorMessages.push('Nama wajib diisi!');
    }

    if (!req.body.address) {
      errorMessages.push('Alamat wajib diisi!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const userLogin = await user
      .findOne({ _id: req.user.user })
      .select('-password');

    if (userLogin.role === 'admin') {
      if (!req.body.user) {
        errorMessages.push('Korlap tidak boleh kosong!');
      }

      if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
        errorMessages.push('ID Korlap tidak valid!');
      }

      const findUser = await user.findOne({ _id: req.body.user });

      if (!findUser) {
        errorMessages.push('Korlap tidak ditemukan!');
      }
    } else {
      req.body.user = userLogin._id;
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
