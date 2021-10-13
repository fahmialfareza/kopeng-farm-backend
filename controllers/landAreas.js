const { landArea } = require('../models');

class LandAreas {
  async getAllLandAreas(req, res, next) {
    try {
      const data = await landArea.find().populate('farmer');

      if (data.length === 0) {
        return next({ message: 'Land Areas not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOneLandArea(req, res, next) {
    try {
      const data = await landArea
        .findOne({ _id: req.params.id })
        .populate('farmer');

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

      data = await landArea.findOne({ _id: data._id }).populate('farmer');

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateLandArea(req, res, next) {
    try {
      const data = await landArea
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate('farmer');

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
