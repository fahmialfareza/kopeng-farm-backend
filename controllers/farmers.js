const { farmer } = require('../models');

class Farmers {
  async getAllFarmers(req, res, next) {
    try {
      const data = await farmer.find();

      if (data.length === 0) {
        return next({ message: 'Farmers not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOneFarmer(req, res, next) {
    try {
      const data = await farmer.findOne({ _id: req.params.id });

      if (!data) {
        return next({ message: 'Farmer not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createFarmer(req, res, next) {
    try {
      const data = await farmer.create(req.body);

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateFarmer(req, res, next) {
    try {
      const data = await farmer.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: 'Farmer not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteFarmer(req, res, next) {
    try {
      const data = await farmer.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Farmer not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'Farmer has been deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Farmers();
