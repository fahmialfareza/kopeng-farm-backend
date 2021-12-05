const { merchant, user, harvest } = require('../models');
const moment = require('moment');

class Merchants {
  async getAllMerchants(req, res, next) {
    try {
      let findData = {};
      let data = [];

      req.query.createdAtStart &&
        (findData.createdAt = {
          $gte: new Date(req.query.createdAtStart),
        });
      req.query.createdAtEnd &&
        (findData.createdAt = {
          ...findData.createdAt,
          $lte: new Date(moment(req.query.createdAtEnd).add(1, 'days')),
        });
      req.query.farmer && (findData.farmer = req.query.farmer);
      req.query.plantDateStart &&
        (findData.plantDate = {
          $gte: new Date(req.query.plantDateStart),
        });
      req.query.plantDateEnd &&
        (findData.plantDate = {
          ...findData.plantDate,
          $lte: new Date(moment(req.query.plantDateEnd).add(1, 'days')),
        });

      const userLogin = await user
        .findOne({ _id: req.user.user })
        .select('-password');

      if (userLogin.role === 'admin') {
        data = await merchant
          .find(findData)
          .populate({
            path: 'farmer',
            populate: { path: 'user', select: '-password' },
          })
          .populate('landArea')
          .populate({ path: 'seedType', populate: { path: 'vegetable' } });
      } else {
        data = await merchant
          .find(findData)
          .populate({
            path: 'farmer',
            match: { user: userLogin._id },
            populate: [
              {
                path: 'user',
                select: '-password',
              },
            ],
          })
          .populate('landArea')
          .populate({ path: 'seedType', populate: { path: 'vegetable' } });
      }

      if (data.length === 0) {
        return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
      }

      data = data.filter(
        (item) =>
          item.farmer !== null &&
          item.landArea !== null &&
          item.seedType !== null
      );
      data = data.filter(
        (item) => item.farmer.user !== null && item.seedType.vegetable !== null
      );

      data = data.map((item) => {
        return {
          ...item._doc,
          plantDate: `${moment(item.plantDate)
            .locale('id')
            .format('dddd, Do MMMM YYYY')}`,
          createdAt: `${moment(item.createdAt)
            .locale('id')
            .format('dddd, Do MMMM YYYY')}`,
          masapanen1: item.harvestsEstimation[0]
            ? `${item.harvestsEstimation[0].name} (${moment(
                item.harvestsEstimation[0].start
              )
                .locale('id')
                .format('Do MMMM YYYY')} - ${moment(
                item.harvestsEstimation[0].end
              )
                .locale('id')
                .format('Do MMMM YYYY')})`
            : '',
          masapanen2: item.harvestsEstimation[1]
            ? `${item.harvestsEstimation[1].name} (${moment(
                item.harvestsEstimation[1].start
              )
                .locale('id')
                .format('Do MMMM YYYY')} - ${moment(
                item.harvestsEstimation[1].end
              )
                .locale('id')
                .format('Do MMMM YYYY')})`
            : '',
          masapanen3: item.harvestsEstimation[2]
            ? `${item.harvestsEstimation[2].name} (${moment(
                item.harvestsEstimation[2].start
              )
                .locale('id')
                .format('Do MMMM YYYY')} - ${moment(
                item.harvestsEstimation[2].end
              )
                .locale('id')
                .format('Do MMMM YYYY')})`
            : '',
          masapanen4: item.harvestsEstimation[3]
            ? `${item.harvestsEstimation[3].name} (${moment(
                item.harvestsEstimation[3].start
              )
                .locale('id')
                .format('Do MMMM YYYY')} - ${moment(
                item.harvestsEstimation[3].end
              )
                .locale('id')
                .format('Do MMMM YYYY')})`
            : '',
          masapanen5: item.harvestsEstimation[4]
            ? `${item.harvestsEstimation[4].name} (${moment(
                item.harvestsEstimation[4].start
              )
                .locale('id')
                .format('Do MMMM YYYY')} - ${moment(
                item.harvestsEstimation[4].end
              )
                .locale('id')
                .format('Do MMMM YYYY')})`
            : '',
        };
      });

      if (data.length === 0) {
        return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailMerchant(req, res, next) {
    try {
      const data = await merchant
        .findOne({ _id: req.params.id })
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

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createMerchant(req, res, next) {
    try {
      let data = await merchant.create(req.body);

      data = await merchant.findOne({ _id: data._id });

      if (!data) {
        return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateMerchant(req, res, next) {
    try {
      const data = await merchant
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate({
          path: 'farmer',
          populate: { path: 'user', select: '-password' },
        })
        .populate('landArea')
        .populate({ path: 'seedType', populate: { path: 'vegetable' } });

      if (!data) {
        return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
      }

      // Update harvests
      const findHarvest = await harvest.findOne({ merchant: data._id });

      if (findHarvest) {
        const { totalAmount, commissionAmount } = findHarvest;
        const seedTypePrice = data.seedType.price;
        const debt = data.population * seedTypePrice;
        const netAmount = totalAmount - commissionAmount - debt;

        const updatedHarvest = {
          commissionAmount,
          totalAmount,
          debt,
          netAmount,
        };

        await harvest.findOneAndUpdate(
          { _id: findHarvest._id },
          updatedHarvest,
          {
            new: true,
          }
        );
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteMerchant(req, res, next) {
    try {
      const data = await merchant.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Mitra tidak ditemukan!', statusCode: 404 });
      }

      res.status(200).json({ message: 'Mitra telah dihapus!' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Merchants();
