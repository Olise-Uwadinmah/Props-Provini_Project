const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// A quick test to ensure the connection works
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database Connection Error:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL at:', res.rows[0].now);
  }
});

module.exports = pool;