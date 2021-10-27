const jwt = require('jsonwebtoken'); // import jwt
const { user } = require('../models');

class Auth {
  async getAllUsers(req, res, next) {
    try {
      const data = await user.find();

      if (data.length === 0) {
        return next({ message: 'Users not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const newUser = await user.create(req.body);

      const data = await user.findOne({ _id: newUser._id }).select('-password');

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const data = await user.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: 'User not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const data = await user.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'User not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'User has been deleted' });
    } catch (error) {
      next(error);
    }
  }

  getToken(req, res, next) {
    try {
      const data = {
        user: req.user._id,
      };

      const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '60d',
      });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const data = await user
        .findOne({ _id: req.user.user })
        .select('-password');

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
