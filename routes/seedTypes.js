const express = require('express');

const { admin, adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateSeedTypeValidator,
} = require('../middlewares/validators/seedTypes');

const {
  getAllSeedTypes,
  getOneSeedType,
  createSeedType,
  updateSeedType,
  deleteSeedType,
} = require('../controllers/seedTypes');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllSeedTypes)
  .post(admin, createOrUpdateSeedTypeValidator, createSeedType);

router
  .route('/:id')
  .put(admin, createOrUpdateSeedTypeValidator, updateSeedType)
  .delete(admin, deleteSeedType);

module.exports = router;
