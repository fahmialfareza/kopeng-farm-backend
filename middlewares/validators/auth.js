const validator = require('validator');
const { farmer } = require('../../models');

function validateUserName(username) {
  var usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
}

exports.createOrUpdateUserValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!req.body.name) {
      errorMessages.push('Nama wajib diisi!');
    }

    if (!validateUserName(req.body.username)) {
      errorMessages.push('Username tidak valid!');
    }

    if (
      !validator.isStrongPassword(req.body.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false,
      })
    ) {
      errorMessages.push(
        'Password harus mengandung huruf besar, kecil, dan angka serta minimal 8 karakter!'
      );
    }

    if (!validator.isMobilePhone(req.body.mobileNumber, 'id-ID')) {
      errorMessages.push('Nomor HP tidak valid!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.signInValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!validateUserName(req.body.username)) {
      errorMessages.push('Username tidak valid!');
    }

    if (
      !validator.isStrongPassword(req.body.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      errorMessages.push(
        'Password harus mengandung huruf besar, kecil, dan angka serta minimal 8 karakter!'
      );
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteUserValidator = async (req, res, next) => {
  try {
    const data = await farmer.find({ farmer: req.params.id });

    if (data.length > 0) {
      return next({
        message: 'Anda tidak bisa menghapus data ini!',
        statusCode: 403,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
