const { landArea, user } = require('../models');

class LandAreas {
  async getAllLandAreas(req, res, next) {
    try {
      let data = [];

      const userLogin = await user
        .findOne({ _id: req.user.user })
        .select('-password');

      if (userLogin.role === 'admin') {
        data = await landArea.find().populate({
          path: 'farmer',
          populate: {
            path: 'user',
            select: '-password',
          },
        });
      } else {
        data = await landArea.find().populate({
          path: 'farmer',
          match: { user: req.user.user },
          populate: {
            path: 'user',
            select: '-password',
          },
        });
      }

      data = data.filter((item) => item.farmer !== null);

      if (data.length === 0) {
        return next({ message: 'Land Areas not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailLandArea(req, res, next) {
    try {
      const data = await landArea.find({ _id: req.params.id }).populate({
        path: 'farmer',
        populate: {
          path: 'user',
          select: '-password',
        },
      });

      if (!data) {
        return next({ message: 'Land Area not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createLandArea(req, res, next) {
    try {
      let data = await landArea.create(req.body);

      data = await landArea.findOne({ _id: data._id });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateLandArea(req, res, next) {
    try {
      const data = await landArea.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: 'Land Area not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteLandArea(req, res, next) {
    try {
      const data = await landArea.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Land Area not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'Land Area has been deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LandAreas();
