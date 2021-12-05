const validator = require('validator');
const mongoose = require('mongoose');
const { merchant } = require('../../models');

exports.createOrUpdateHarvestValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.merchant)) {
      errorMessages.push('ID Mitra tidak valid!');
    }

    if (!validator.isNumeric(req.body.production)) {
      errorMessages.push('Produksi harus angka!');
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const data = await merchant
      .findOne({ _id: req.body.merchant })
      .populate({
        path: 'farmer',
        populate: { path: 'user', select: '-password' },
      })
      .populate('landArea')
      .populate({ path: 'seedType', populate: { path: 'vegetable' } });

    if (!data || !data.farmer || !data.landArea || !data.seedType) {
      return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
    }

    if (!data.farmer.user || !data.seedType.vegetable) {
      return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
    }

    const vegetablePrice = data.seedType.vegetable.price;
    const vegetableCommission = data.seedType.vegetable.commission;
    const seedTypePrice = data.seedType.price;
    const production = parseInt(req.body.production);
    const totalAmount = production * vegetablePrice;
    const commissionAmount = (vegetableCommission * totalAmount) / 100;
    const debt = data.population * seedTypePrice;
    const netAmount = totalAmount - commissionAmount - debt;

    req.body.commissionAmount = commissionAmount;
    req.body.totalAmount = totalAmount;
    req.body.debt = debt;
    req.body.netAmount = netAmount;

    next();
  } catch (error) {
    next(error);
  }
};
