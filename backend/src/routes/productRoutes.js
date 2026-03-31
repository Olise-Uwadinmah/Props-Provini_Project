const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductByBarcode, 
    updateProduct, 
    addProduct 
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:barcode', getProductByBarcode);
router.post('/add', addProduct);
router.put('/update-product', updateProduct);

module.exports = router;