const { landArea } = require('../models');

class LandAreas {
  async getAllCustomers(req, res, next) {
    try {
      const data = await customer.find();

      if (data.length === 0) {
        return next({ message: 'Customers not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LandAreas();
