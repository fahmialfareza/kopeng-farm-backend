const { vegetable, plant } = require('../models');

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

      const plants = await plant.find({ vegetable: data._id });

      for (let index = 0; index < plants.length; index++) {
        let updatedPlant = await plant.findOne({ _id: plants[index]._id });

        updatedPlant.price = eval(
          req.body.price * updatedPlant.productionEstimation
        );
        await updatedPlant.save();
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Vegetables();
