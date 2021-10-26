const { seedType } = require('../models');

class SeedTypes {
  async getAllSeedTypes(req, res, next) {
    try {
      const data = await seedType.find();

      if (data.length === 0) {
        return next({ message: 'Seed Types not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createSeedType(req, res, next) {
    try {
      const data = await seedType.create(req.body);

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateSeedType(req, res, next) {
    try {
      const data = await seedType.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: 'Seed Type not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteSeedType(req, res, next) {
    try {
      const data = await seedType.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Seed Type not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'Seed Type has been deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SeedTypes();
