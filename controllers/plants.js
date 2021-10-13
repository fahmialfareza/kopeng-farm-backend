const { plant } = require('../models');

class Plants {
  async getAllPlants(req, res, next) {
    try {
      const data = await plant
        .find()
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

      if (data.length === 0) {
        return next({ message: 'Plants not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOnePlant(req, res, next) {
    try {
      const data = await plant
        .findOne({ _id: req.params.id })
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

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

      data = await plant
        .findOne({ _id: data._id })
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

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
      const data = await plant
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

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
