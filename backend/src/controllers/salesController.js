const pool = require('../db');

exports.createSale = async (req, res) => {
    const client = await pool.connect(); // Get a dedicated client for the transaction
    try {
        const { items, payment_method, tax_amount, total_amount } = req.body;

        await client.query('BEGIN'); // Start the Transaction

        // 1. Insert into Sales Table
        const saleRes = await client.query(
            'INSERT INTO sales (total_amount, tax_amount, payment_method) VALUES ($1, $2, $3) RETURNING id',
            [total_amount, tax_amount, payment_method]
        );
        const saleId = saleRes.rows[0].id;

        // 2. Loop through items to update stock and record sale items
        for (let item of items) {
            // Update Inventory (Decrement stock)
            const updateStock = await client.query(
                'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 RETURNING stock_quantity',
                [item.quantity, item.product_id]
            );

            if (updateStock.rows[0].stock_quantity < 0) {
                throw new Error(`Insufficient stock for product ID ${item.product_id}`);
            }

            // Record the specific item sold
            await client.query(
                'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
                [saleId, item.product_id, item.quantity, item.unit_price]
            );
        }

        await client.query('COMMIT'); // Save everything permanently
        res.status(201).json({ message: 'Sale completed successfully', saleId });

    } catch (err) {
        await client.query('ROLLBACK'); // Cancel everything if there's an error
        console.error(err.message);
        res.status(500).json({ error: err.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};