const validator = require('validator');
const mongoose = require('mongoose');
const { farmer, landArea, seedType, vegetable, user } = require('../../models');

exports.createOrUpdatePlantValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.farmer)) {
      errorMessages.push('ID farmer is not valid!');
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.landArea)) {
      errorMessages.push('ID land area is not valid!');
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.seedType)) {
      errorMessages.push('ID seed type is not valid!');
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.vegetable)) {
      errorMessages.push('ID vegetable is not valid!');
    }

    if (!validator.isDate(req.body.plantDate)) {
      errorMessages.push('Plant date must be date!');
    }

    if (!validator.isNumeric(req.body.population)) {
      errorMessages.push('Population must be number!');
    }

    if (!validator.isNumeric(req.body.productionEstimation)) {
      errorMessages.push('Production estimation must be number!');
    }

    if (!req.body.harvestEstimation) {
      errorMessages.push('Harvest Estimation is required!');
    }

    if (req?.body?.production && !validator.isNumeric(req.body.production)) {
      errorMessages.push('Production must be number!');
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
      errorMessages.push('ID user is not valid!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    req.body.harvestEstimation.map((data) => {
      if (!validator.isDate(data.start)) {
        errorMessages.push('Harvest Estimation start date must be date!');
      }
      if (!validator.isDate(data.end)) {
        errorMessages.push('Harvest Estimation start date must be date!');
      }
    });

    req?.body?.harvest?.map((data) => {
      if (!validator.isDate(data.start)) {
        errorMessages.push('Harvest start date must be date!');
      }
      if (!validator.isDate(data.end)) {
        errorMessages.push('Harvest start date must be date!');
      }
    });

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const data = await Promise.all([
      farmer.findOne({ _id: req.body.farmer }),
      landArea.findOne({ _id: req.body.landArea }),
      seedType.findOne({ _id: req.body.seedType }),
      vegetable.findOne({ _id: req.body.vegetable }),
      user.findOne({ _id: req.body.user }),
    ]);

    data.map((dat, index) => {
      if (dat === null) {
        if (index === 0) {
          errorMessages.push('Farmer not found!');
        }
        if (index === 1) {
          errorMessages.push('Land Area not found!');
        }
        if (index === 2) {
          errorMessages.push('Seed Type not found!');
        }
        if (index === 3) {
          errorMessages.push('Vegetable not found!');
        }
        if (index === 4) {
          errorMessages.push('User not found!');
        }
      }
    });

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
