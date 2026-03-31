```markdown
# Provini Supermarket POS System

A high-performance Point of Sale (POS) application built with the **PERN stack** (PostgreSQL, Express, JS, Node.js). Designed specifically for the Nigerian retail market with localized tax compliance and rapid keyboard-first navigation.

## 🚀 Key Features

* **Localized for Nigeria:** * Currency set to **Naira (₦)** with standard formatting.
    * Automatic **7.5% VAT** calculation on all transactions.
* **Dual-Role Interface:**
    * **Cashier View:** Optimized for speed with barcode scanning and bulk item multipliers (e.g., typing `12*1001` to add a dozen items).
    * **Manager Dashboard:** Secure PIN-protected access to inventory levels, stock restocking, and price management.
* **Keyboard-First Workflow:** Full support for `Tab` and `Enter` keys to minimize mouse usage and maximize throughput.
* **Real-time Inventory:** Direct integration with PostgreSQL to subtract stock automatically upon checkout.
* **Print-Ready Receipts:** Generates a professional, thermal-style receipt layout for every successful sale.

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Modern Dark Theme)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Testing:** Postman

## 📋 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/provini-pos.git](https://github.com/yourusername/provini-pos.git)
   cd provini-pos
   ```

2. **Install Dependencies:**
   ```bash
   # From the backend folder
   npm install
   ```

3. **Database Configuration:**
   * Create a database named `supermarket_db` in PostgreSQL.
   * Run the provided SQL schema to create the `products` and `sales` tables.
   * Update `src/db.js` with your PostgreSQL credentials.

4. **Run the Application:**
   ```bash
   # Start the backend server
   node src/server.js
   
   # Open frontend/index.html in your browser
   ```

## 🔒 Security Note
The `.gitignore` file is configured to exclude `node_modules/` and environment variables. Ensure your database credentials are kept private.

---
**Developed by Provini Tech**
```
