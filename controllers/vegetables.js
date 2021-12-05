const { vegetable, merchant, harvest } = require('../models');

class Vegetables {
  async getAllVegetables(req, res, next) {
    try {
      const data = await vegetable.find();

      if (data.length === 0) {
        return next({ message: 'Sayur tidak ditemukan!', statusCode: 404 });
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
        return next({ message: 'Sayur tidak ditemukan!', statusCode: 404 });
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
        return next({ message: 'Sayur tidak ditemukan!', statusCode: 404 });
      }

      // Update Merchants
      let merchants = await merchant.find().populate({
        path: 'seedType',
        populate: { path: 'vegetable', match: { _id: data._id } },
      });

      merchants = merchants.filter((merchant) => merchant.seedType !== null);
      merchants = merchants.filter(
        (merchant) => merchant.seedType.vegetable !== null
      );

      for (let index = 0; index < merchants.length; index++) {
        let updatedMerchant = await merchant.findOne({
          _id: merchants[index]._id,
        });

        updatedMerchant.priceEstimation = eval(
          req.body.price * updatedMerchant.productionEstimation
        );
        await updatedMerchant.save();
      }

      // Update Harvest
      const findHarvests = await harvest.find().populate({
        path: 'merchant',
        populate: [
          {
            path: 'farmer',
            populate: { path: 'user', select: '-password' },
          },
          { path: 'landArea' },
          {
            path: 'seedType',
            populate: { path: 'vegetable', match: { _id: data._id } },
          },
        ],
      });

      if (findHarvests.length > 0) {
        for (let i = 0; i < findHarvests.length; i++) {
          if (findHarvests[i] && findHarvests[i].merchant) {
            if (
              findHarvests[i].merchant.farmer &&
              findHarvests[i].merchant.landArea &&
              findHarvests[i].merchant.seedType
            ) {
              if (
                findHarvests[i].merchant.farmer.user &&
                findHarvests[i].merchant.seedType.vegetable
              ) {
                const { debt, production } = findHarvests[i];
                const vegetablePrice = data.price;
                const vegetableCommission = data.commission;
                const totalAmount = production * vegetablePrice;
                const commissionAmount =
                  (vegetableCommission * totalAmount) / 100;
                const netAmount = totalAmount - commissionAmount - debt;

                const updatedHarvest = {
                  commissionAmount,
                  totalAmount,
                  debt,
                  netAmount,
                };

                await harvest.findOneAndUpdate(
                  { _id: findHarvests[i]._id },
                  updatedHarvest,
                  {
                    new: true,
                  }
                );
              }
            }
          }
        }
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Vegetables();
