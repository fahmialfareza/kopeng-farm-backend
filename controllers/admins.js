const jwt = require('jsonwebtoken'); // import jwt
const { admin } = require('../models');

class Auth {
  getToken(req, res, next) {
    try {
      const data = {
        admin: req.admin._id,
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
      const data = await admin
        .findOne({ _id: req.admin.admin })
        .select('-password');

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
