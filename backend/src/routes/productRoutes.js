const express = require('express');
const router = express.Router();
// Import the functions from the controller
const { 
    getProducts, 
    getProductByBarcode, 
    updateProduct 
} = require('../controllers/productController');

// Define the routes
router.get('/', getProducts);
router.get('/:barcode', getProductByBarcode);

// Line 10: This must match the name 'updateProduct' exactly
router.put('/update-product', updateProduct);

module.exports = router;