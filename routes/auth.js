const express = require('express');

// Import auth
const { signin, admin, adminOrUser } = require('../middlewares/auth');

// Import validator
const {
  createUserValidator,
  signInValidator,
} = require('../middlewares/validators/auth');

// Import controller
const { createUser, getToken, getMe } = require('../controllers/auth');

// Make router
const router = express.Router();

// Make routes
router.post('/createUser', admin, createUserValidator, createUser);
router.post('/signin', signInValidator, signin, getToken);
router.get('/me', adminOrUser, getMe);

// Exports
module.exports = router;
