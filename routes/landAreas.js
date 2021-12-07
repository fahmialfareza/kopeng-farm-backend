const express = require('express');

const { adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateLandAreaValidator,
  deleteLandAreaValidator,
} = require('../middlewares/validators/landAreas');

const {
  getAllLandAreas,
  createLandArea,
  updateLandArea,
  deleteLandArea,
  getDetailLandArea,
} = require('../controllers/landAreas');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllLandAreas)
  .post(adminOrUser, createOrUpdateLandAreaValidator, createLandArea);

router
  .route('/:id')
  .get(adminOrUser, getDetailLandArea)
  .put(adminOrUser, createOrUpdateLandAreaValidator, updateLandArea)
  .delete(adminOrUser, deleteLandAreaValidator, deleteLandArea);

module.exports = router;
