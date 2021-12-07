const express = require('express');

const { adminOrUser } = require('../middlewares/auth');

const {
  createOrUpdateMerchantValidator,
  deleteMerchantValidator,
} = require('../middlewares/validators/merchants');

const {
  getAllMerchants,
  getDetailMerchant,
  createMerchant,
  updateMerchant,
  deleteMerchant,
} = require('../controllers/merchants');

const router = express.Router();

router
  .route('/')
  .get(adminOrUser, getAllMerchants)
  .post(adminOrUser, createOrUpdateMerchantValidator, createMerchant);

router
  .route('/:id')
  .get(adminOrUser, getDetailMerchant)
  .put(adminOrUser, createOrUpdateMerchantValidator, updateMerchant)
  .delete(adminOrUser, deleteMerchantValidator, deleteMerchant);

module.exports = router;
