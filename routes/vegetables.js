const express = require('express');

const { admin, adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateVegetableValidator,
} = require('../middlewares/validators/Vegetables');

const {
  getAllVegetables,
  getOneVegetable,
  createVegetable,
  updateVegetable,
  deleteVegetable,
} = require('../controllers/Vegetables');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllVegetables)
  .post(admin, createOrUpdateVegetableValidator, createVegetable);

router
  .route('/:id')
  .get(adminOrUser, getOneVegetable)
  .put(admin, createOrUpdateVegetableValidator, updateVegetable)
  .delete(admin, deleteVegetable);

module.exports = router;
