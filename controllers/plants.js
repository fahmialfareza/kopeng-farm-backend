const { plant, user } = require('../models');
const moment = require('moment');
const xlsx = require('json-as-xlsx');

class Plants {
  async getAllPlants(req, res, next) {
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
      req.query.vegetable && (findData.vegetable = req.query.vegetable);
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
        data = await plant
          .find(findData)
          .populate({
            path: 'farmer',
            populate: { path: 'user', select: '-password' },
          })
          .populate('landArea')
          .populate('seedType')
          .populate('vegetable');
      } else {
        data = await plant
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
          .populate('seedType')
          .populate('vegetable');
      }

      data = data.filter((item) => item.farmer !== null);

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
        return next({ message: 'Plants not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailPlant(req, res, next) {
    try {
      const data = await plant
        .find({ _id: req.params.id })
        .populate({
          path: 'farmer',
          populate: { path: 'user', select: '-password' },
        })
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable');

      if (!data) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createPlant(req, res, next) {
    try {
      let data = await plant.create(req.body);

      data = await plant.findOne({ _id: data._id });

      if (!data) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updatePlant(req, res, next) {
    try {
      const data = await plant.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deletePlant(req, res, next) {
    try {
      const data = await plant.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'Plant has been deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Plants();
