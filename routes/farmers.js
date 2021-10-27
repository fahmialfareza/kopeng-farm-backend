const express = require('express');

const { adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateFarmerValidator,
} = require('../middlewares/validators/farmers');

const {
  getAllFarmers,
  getDetailFarmer,
  createFarmer,
  updateFarmer,
  deleteFarmer,
} = require('../controllers/farmers');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllFarmers)
  .post(adminOrUser, createOrUpdateFarmerValidator, createFarmer);

router
  .route('/:id')
  .get(adminOrUser, getDetailFarmer)
  .put(adminOrUser, createOrUpdateFarmerValidator, updateFarmer)
  .delete(adminOrUser, deleteFarmer);

module.exports = router;
