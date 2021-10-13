const express = require('express');

const { adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateLandAreaValidator,
} = require('../middlewares/validators/landAreas');

const {
  getAllLandAreas,
  getOneLandArea,
  createLandArea,
  updateLandArea,
  deleteLandArea,
} = require('../controllers/landAreas');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllLandAreas)
  .post(adminOrUser, createOrUpdateLandAreaValidator, createLandArea);

router
  .route('/:id')
  .get(adminOrUser, getOneLandArea)
  .put(adminOrUser, createOrUpdateLandAreaValidator, updateLandArea)
  .delete(adminOrUser, deleteLandArea);

module.exports = router;
