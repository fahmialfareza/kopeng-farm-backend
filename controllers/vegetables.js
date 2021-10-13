const { vegetable } = require('../models');

class Vegetables {
  async getAllVegetables(req, res, next) {
    try {
      const data = await vegetable.find();

      if (data.length === 0) {
        return next({ message: 'Vegetables not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOneVegetable(req, res, next) {
    try {
      const data = await vegetable.findOne({ _id: req.params.id });

      if (!data) {
        return next({ message: 'Vegetable not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createVegetable(req, res, next) {
    try {
      const data = await vegetable.create(req.body);

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateVegetable(req, res, next) {
    try {
      const data = await vegetable.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: 'Vegetable not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteVegetable(req, res, next) {
    try {
      const data = await vegetable.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Vegetable not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'Vegetable has been deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Vegetables();
