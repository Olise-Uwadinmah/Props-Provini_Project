const express = require('express');
const router = express.Router();
// Make sure addStock is included in this curly bracket list!
const { getProducts, getProductByBarcode, addStock } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:barcode', getProductByBarcode);

// The new PUT route for updating data
router.put('/add-stock', addStock);

module.exports = router;