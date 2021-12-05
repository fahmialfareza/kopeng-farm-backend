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

router.route('/').get(adminOrUser, getAllSeedTypes);

router
  .route('/:id')
  .get(admin, getOneSeedType)
  .put(admin, createOrUpdateSeedTypeValidator, updateSeedType);

module.exports = router;
