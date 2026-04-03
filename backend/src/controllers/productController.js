const pool = require('../db');

// 1. Get Next Barcode (Automation)
exports.getNextBarcode = async (req, res) => {
    try {
        // This looks for the highest numeric barcode in your DB
        const result = await pool.query(`
            SELECT barcode FROM products 
            WHERE barcode ~ '^[0-9]+$' 
            ORDER BY CAST(barcode AS INTEGER) DESC LIMIT 1
        `);
        
        let nextBarcode = "1001"; // Default start if table is empty
        if (result.rows.length > 0) {
            nextBarcode = (parseInt(result.rows[0].barcode) + 1).toString();
        }
        res.json({ nextBarcode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Add New Product
exports.addProduct = async (req, res) => {
    const { name, barcode, price, stock_quantity, category } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO products (name, barcode, price, stock_quantity, category) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, barcode, price, stock_quantity || 0, category || 'General']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Master Update (Rename/Category/Stock/Price)
exports.updateProduct = async (req, res) => {
    const { id } = req.body;
    const name = req.body.name || null;
    const category = req.body.category || null;
    const price = req.body.price || null;
    const quantity = parseInt(req.body.quantity) || 0;

    try {
        const result = await pool.query(
            `UPDATE products 
             SET name = COALESCE($1, name),
                 stock_quantity = stock_quantity + $2, 
                 price = COALESCE($3, price),
                 category = COALESCE($4, category)
             WHERE id = $5 RETURNING *`,
            [name, quantity, price, category, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "ID not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get All (For Table)
exports.getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Get By Barcode (For Scanner)
exports.getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};