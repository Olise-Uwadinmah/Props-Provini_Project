const express = require('express');
const router = express.Router();
const { createSale } = require('../controllers/salesController');

router.post('/checkout', createSale);

module.exports = router;