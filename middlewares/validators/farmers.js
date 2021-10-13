const validator = require('validator');

exports.createOrUpdateFarmerValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (
      !validator.isNumeric(req.body.id_number) ||
      req.body.id_number.length !== 16
    ) {
      errorMessages.push('ID Number must be 16 digits number!');
    }

    if (!req.body.name) {
      errorMessages.push('Name is required!');
    }

    if (!req.body.address) {
      errorMessages.push('Address is required!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
