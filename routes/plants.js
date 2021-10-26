const express = require('express');

const { adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdatePlantValidator,
} = require('../middlewares/validators/plants');

const {
  getAllPlants,
  getOnePlant,
  createPlant,
  updatePlant,
  deletePlant,
  exportsToXlxs,
} = require('../controllers/plants');

const router = express.Router();

router.get('/exportstoxlsx', adminOrUser, exportsToXlxs);

router
  .route('/')
  .get(adminOrUser, getAllPlants)
  .post(adminOrUser, createOrUpdatePlantValidator, createPlant);

router
  .route('/:id')
  .put(adminOrUser, createOrUpdatePlantValidator, updatePlant)
  .delete(adminOrUser, deletePlant);

module.exports = router;
