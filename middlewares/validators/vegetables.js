const validator = require('validator');

exports.createOrUpdateVegetableValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!req.body.name) {
      errorMessages.push('Nama wajib diisi!');
    }

    if (!validator.isNumeric(req.body.price)) {
      errorMessages.push('Harga wajib diisi!');
    }

    if (!validator.isNumeric(req.body.commission)) {
      errorMessages.push('Potongan (persen) wajib diisi!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
