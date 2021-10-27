const express = require('express');

// Import auth
const { signin, admin, adminOrUser } = require('../middlewares/auth');

// Import validator
const {
  createOrUpdateUserValidator,
  signInValidator,
} = require('../middlewares/validators/auth');

// Import controller
const {
  createUser,
  getToken,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
  getDetailUser,
} = require('../controllers/auth');

// Make router
const router = express.Router();

// Make routes
router.post('/createUser', admin, createOrUpdateUserValidator, createUser);
router.post('/signin', signInValidator, signin, getToken);
router.get('/me', adminOrUser, getMe);
router.get('/', admin, getAllUsers);
router.get('/:id', admin, getDetailUser);
router.put('/:id', admin, createOrUpdateUserValidator, updateUser);
router.delete('/:id', admin, deleteUser);

// Exports
module.exports = router;
