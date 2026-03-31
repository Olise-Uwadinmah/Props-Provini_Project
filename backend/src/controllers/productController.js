const pool = require('../db');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single product by barcode (Crucial for Scanners!)
// @route   GET /api/products/:barcode
exports.getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add stock to an existing product
exports.addStock = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        
        // Use SQL to add to the existing total
        const result = await pool.query(
            'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2 RETURNING *',
            [quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ 
            message: "Stock updated successfully", 
            product: result.rows[0] 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.updateProduct = async (req, res) => {
    const { id, quantity, price } = req.body;
    try {
        const result = await pool.query(
            `UPDATE products 
             SET stock_quantity = stock_quantity + $1, 
                 price = COALESCE($2, price) 
             WHERE id = $3 RETURNING *`,
            [quantity || 0, price || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Update successful", product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};