const validator = require('validator');

exports.createOrUpdateSeedTypeValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!req.body.name) {
      errorMessages.push('Name is required!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
