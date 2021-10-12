const express = require('express');

const { getToken, getMe } = require('../controllers/admins');

const router = express.Router();

router.post('/signin', getToken);
router.get('/me', getMe);

module.exports = router;
