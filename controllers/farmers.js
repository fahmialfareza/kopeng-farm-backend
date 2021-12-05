const { farmer, user } = require('../models');

class Farmers {
  async getAllFarmers(req, res, next) {
    try {
      let data = [];

      const userLogin = await user
        .findOne({ _id: req.user.user })
        .select('-password');

      if (userLogin.role === 'admin') {
        data = await farmer
          .find()
          .populate({
            path: 'user',
            select: '-password',
          })
          .populate('landAreas');
      } else {
        data = await farmer
          .find({ user: userLogin._id })
          .populate({
            path: 'user',
            select: '-password',
          })
          .populate('landAreas');
      }

      data = data.filter((item) => item.user !== null);

      if (data.length === 0) {
        return next({ message: 'Petani tidak ditemukan!', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailFarmer(req, res, next) {
    try {
      const data = await farmer
        .findOne({ _id: req.params.id })
        .populate({
          path: 'user',
          select: '-password',
        })
        .populate('landAreas');

      if (!data) {
        return next({ message: 'Petani tidak ditemukan!', statusCode: 404 });
      }

      if (!data.user) {
        return next({ message: 'Petani tidak ditemukan!', statusCode: 404 });
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
        return next({ message: 'Petani tidak ditemukan!', statusCode: 404 });
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
        return next({ message: 'Petani tidak ditemukan!', statusCode: 404 });
      }

      res.status(200).json({ message: 'Berhasil menghapus petani!' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Farmers();
