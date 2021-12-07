const validator = require('validator');
const mongoose = require('mongoose');
const moment = require('moment');
const { farmer, landArea, seedType, harvest } = require('../../models');

exports.createOrUpdateMerchantValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.farmer)) {
      errorMessages.push('ID Petani tidak valid!');
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.landArea)) {
      errorMessages.push('ID Lahan tidak valid!');
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.seedType)) {
      errorMessages.push('ID Jenis Bibit tidak valid!');
    }

    if (!validator.isDate(req.body.plantDate)) {
      errorMessages.push('Tanggal Tanam harus sebuah tanggal!');
    }

    if (!validator.isNumeric(req.body.population)) {
      errorMessages.push('Populasi harus sebuah angka!');
    }

    if (!validator.isNumeric(req.body.productionEstimation)) {
      errorMessages.push('Estimasi Produksi harus sebuah angka!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const data = await Promise.all([
      farmer.findOne({ _id: req.body.farmer }),
      landArea.findOne({ _id: req.body.landArea }),
      seedType.findOne({ _id: req.body.seedType }).populate('vegetable'),
    ]);

    data.map((dat, index) => {
      if (dat === null) {
        if (index === 0) {
          errorMessages.push('Petani tidak ditemukan!');
        }
        if (index === 1) {
          errorMessages.push('Lahan tidak ditemukan!');
        }
        if (index === 2) {
          errorMessages.push('Jenis Bibit tidak ditemukan!');
        }
      } else {
        if (index === 2) {
          if (!dat.vegetable) {
            errorMessages.push('Jenis Bibit tidak ditemukan!');
          }
        }
      }
    });

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    req.body.harvestsEstimation = [];

    data[2].vegetable.harvestsEstimation.map((data, index) => {
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

    req.body.priceEstimation = eval(
      data[2].vegetable.price * req.body.productionEstimation
    );

    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteMerchantValidator = async (req, res, next) => {
  try {
    const harvests = await harvest.find({ merchant: req.params.id });

    if (harvests.length > 0) {
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
