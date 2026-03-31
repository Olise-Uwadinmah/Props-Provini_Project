const pool = require('../db');

// Get all products for the inventory table
exports.getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search product by barcode (used by Cashier)
exports.getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a brand NEW product to the database
exports.addProduct = async (req, res) => {
    const { name, barcode, price, stock_quantity } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO products (name, barcode, price, stock_quantity) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, barcode, price, stock_quantity || 0]
        );
        res.status(201).json({ message: "Product created!", product: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: "Barcode already exists!" });
        res.status(500).json({ error: err.message });
    }
};

// Update existing product (Stock and/or Price)
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
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Update successful", product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};