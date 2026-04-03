const express = require('express');
const router = express.Router();
// Import the controller
const productController = require('../controllers/productController');

// Define routes using the 'productController' object
router.get('/', productController.getProducts);
router.get('/next-barcode', productController.getNextBarcode); // This must be ABOVE the /:barcode route
router.get('/:barcode', productController.getProductByBarcode);
router.post('/add', productController.addProduct);
router.put('/update-product', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;