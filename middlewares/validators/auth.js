const validator = require('validator');

function validateUserName(username) {
  var usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
}

exports.createUserValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!req.body.name) {
      errorMessages.push('Name is required!');
    }

    if (!validateUserName(req.body.username)) {
      errorMessages.push('Username is not valid');
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
      errorMessages.push('Password is not strong enaugh');
    }

    if (!validator.isMobilePhone(req.body.mobileNumber, 'id-ID')) {
      errorMessages.push('Mobile number is not valid');
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
      errorMessages.push('Username is not valid');
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
      errorMessages.push('Password is not strong enaugh');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
