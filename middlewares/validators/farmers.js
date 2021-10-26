const validator = require('validator');
const { user } = require('../../models');

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

    const userLogin = await user
      .findOne({ _id: req.user.user })
      .select('-password');

    if (userLogin.role === 'admin') {
      if (!req.body.user) {
        errorMessages.push('User must be not empty!');
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
