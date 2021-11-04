const validator = require('validator');
const mongoose = require('mongoose');
const moment = require('moment');
const { farmer, landArea, seedType, vegetable } = require('../../models');

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

    if (req?.body?.production && !validator.isNumeric(req.body.production)) {
      errorMessages.push('Production must be number!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    req?.body?.harvests?.map((data) => {
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
      }
    });

    req.body.harvestsEstimation = [];

    data[3].harvestsEstimation.map((data, index) => {
      let startDate = moment(req.body.plantDate)
        .add(data.start, 'weeks')
        .format('YYYY-MM-DD');
      let endDate = moment(req.body.plantDate)
        .add(data.end, 'weeks')
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

      req.body.harvestsEstimation.push({
        name: data.name,
        start: startDate,
        end: endDate,
      });
    });

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    req.body.price = eval(data[3].price * req.body.productionEstimation);

    next();
  } catch (error) {
    next(error);
  }
};
