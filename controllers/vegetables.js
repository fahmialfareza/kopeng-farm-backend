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
}

module.exports = new Vegetables();
