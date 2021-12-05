const { seedType, harvest } = require('../models');

class SeedTypes {
  async getAllSeedTypes(req, res, next) {
    try {
      let data = await seedType.find().populate({ path: 'vegetable' });

      data = data.filter((item) => item.vegetable !== null);

      if (data.length === 0) {
        return next({
          message: 'Jenis Bibit tidak ditemukan!',
          statusCode: 404,
        });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOneSeedType(req, res, next) {
    try {
      const data = await seedType
        .findOne({ _id: req.params.id })
        .populate({ path: 'vegetable' });

      if (!data || !data.vegetable) {
        return next({
          message: 'Jenis Bibit tidak ditemukan!',
          statusCode: 404,
        });
      }

      res.status(200).json({ data });
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
        return next({
          message: 'Jenis Bibit tidak ditemukan!',
          statusCode: 404,
        });
      }

      // Update Harvests
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
            match: { _id: data._id },
            populate: { path: 'vegetable' },
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
                const { totalAmount, commissionAmount } = findHarvests[i];
                const seedTypePrice = data.price;
                const debt =
                  findHarvests[i].merchant.population * seedTypePrice;
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

module.exports = new SeedTypes();
