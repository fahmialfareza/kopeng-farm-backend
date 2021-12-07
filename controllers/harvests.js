const { harvest, user } = require('../models');

class Harvests {
  async getAllHarvests(req, res, next) {
    try {
      let data = [];

      const userLogin = await user
        .findOne({ _id: req.user.user })
        .select('-password');

      if (userLogin.role === 'admin') {
        data = await harvest.find().populate({
          path: 'merchant',
          populate: [
            {
              path: 'farmer',
              populate: { path: 'user', select: '-password' },
            },
            { path: 'landArea' },
            { path: 'seedType', populate: { path: 'vegetable' } },
          ],
        });
      } else {
        data = await harvest.find().populate({
          path: 'merchant',
          populate: [
            {
              path: 'farmer',
              match: { user: userLogin._id },
              populate: [
                {
                  path: 'user',
                  select: '-password',
                },
              ],
            },
            { path: 'landArea' },
            { path: 'seedType', populate: { path: 'vegetable' } },
          ],
        });
      }

      if (data.length === 0) {
        return next({ message: 'Data Panen tidak ditemukan', statusCode: 404 });
      }

      data = data.filter((item) => item.merchant.farmer !== null);

      if (data.length === 0) {
        return next({ message: 'Data Panen tidak ditemukan', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailHarvest(req, res, next) {
    try {
      let data = await harvest.findOne({ _id: req.params.id }).populate({
        path: 'merchant',
        populate: [
          {
            path: 'farmer',
            populate: { path: 'user', select: '-password' },
          },
          { path: 'landArea' },
          { path: 'seedType', populate: { path: 'vegetable' } },
        ],
      });

      if (!data || !data.merchant) {
        return next({
          message: 'Data Panen tidak ditemukan',
          statusCode: 404,
        });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createHarvest(req, res, next) {
    try {
      let data = await harvest.create(req.body);

      data = await harvest.findOne({ _id: data._id });

      if (!data) {
        return next({
          message: 'Data Panen tidak ditemukan!',
          statusCode: 404,
        });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateHarvest(req, res, next) {
    try {
      const data = await harvest.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({
          message: 'Data Panen tidak ditemukan!',
          statusCode: 404,
        });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteHarvest(req, res, next) {
    try {
      const data = await harvest.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({
          message: 'Data Panen tidak ditemukan!',
          statusCode: 404,
        });
      }

      res.status(200).json({ message: 'Data Panen telah dihapus!' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Harvests();
