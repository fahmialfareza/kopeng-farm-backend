const express = require('express');

const { admin, adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateVegetableValidator,
} = require('../middlewares/validators/vegetables');

const {
  getAllVegetables,
  updateVegetable,
  getOneVegetable,
} = require('../controllers/vegetables');

const router = express.Router();

router.route('/').get(adminOrUser, getAllVegetables);
router
  .route('/:id')
  .get(adminOrUser, getOneVegetable)
  .put(admin, createOrUpdateVegetableValidator, updateVegetable);

module.exports = router;
