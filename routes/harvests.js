const express = require('express');

const { adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateHarvestValidator,
} = require('../middlewares/validators/harvests');

const {
  getAllHarvests,
  getDetailHarvest,
  createHarvest,
  updateHarvest,
  deleteHarvest,
} = require('../controllers/harvests');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllHarvests)
  .post(adminOrUser, createOrUpdateHarvestValidator, createHarvest);

router
  .route('/:id')
  .get(adminOrUser, getDetailHarvest)
  .put(adminOrUser, createOrUpdateHarvestValidator, updateHarvest)
  .delete(adminOrUser, deleteHarvest);

module.exports = router;
