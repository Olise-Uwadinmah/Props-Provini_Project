const API_URL = 'http://localhost:5000/api';

// 1. Simple PIN Protection for Defense
// Note: In a real app, use JWT tokens. For a project defense, this shows the "Concept" of access control.
const pin = prompt("Enter Manager PIN to access Inventory:");
if (pin !== "1234") {
    alert("Unauthorized Access!");
    window.location.href = "index.html";
}

// 2. Fetch and Display All Products
async function loadInventory() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const tableBody = document.getElementById('inventory-body');
        tableBody.innerHTML = ''; // Clear current list

        products.forEach(p => {
            // Check if stock is low (less than 10 units)
            const stockClass = p.stock_quantity < 10 ? 'low-stock' : '';
            const stockText = p.stock_quantity < 10 ? `${p.stock_quantity} (Low!)` : p.stock_quantity;

            tableBody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.barcode}</td>
                    <td>₦${parseFloat(p.price).toLocaleString()}</td>
                    <td class="${stockClass}">${stockText}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Failed to load inventory:", err);
    }
}

// 3. Handle Restocking
document.getElementById('restock-btn').addEventListener('click', async () => {
    const id = document.getElementById('stock-id').value;
    const quantity = document.getElementById('stock-qty').value;

    if (!id || !quantity) return alert("Enter both ID and Quantity");

    try {
        const response = await fetch(`${API_URL}/products/add-stock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), quantity: parseInt(quantity) })
        });

        if (response.ok) {
            alert("✅ Stock updated successfully!");
            document.getElementById('stock-id').value = '';
            document.getElementById('stock-qty').value = '';
            loadInventory(); // Refresh the list automatically
        }
    } catch (err) {
        alert("Server error during update.");
    }
});
// 1. Handle the 'Enter' key globally on this page
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Only trigger if the user is currently typing in one of our inputs
        const active = document.activeElement;
        if (active.id === 'stock-id' || active.id === 'stock-qty' || active.id === 'stock-price') {
            document.getElementById('restock-btn').click();
        }
    }
});

// 2. Updated Update Function
document.getElementById('restock-btn').addEventListener('click', async () => {
    const id = document.getElementById('stock-id').value;
    const qty = document.getElementById('stock-qty').value;
    const price = document.getElementById('stock-price').value;

    if (!id) return alert("Please enter a Product ID");

    try {
        const response = await fetch(`${API_URL}/products/update-product`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: parseInt(id), 
                quantity: qty ? parseInt(qty) : 0, 
                price: price ? parseFloat(price) : null 
            })
        });

        if (response.ok) {
            alert("✅ Product Updated!");
            // Clear fields and RESET FOCUS to the ID field for the next item
            document.getElementById('stock-id').value = '';
            document.getElementById('stock-qty').value = '';
            document.getElementById('stock-price').value = '';
            document.getElementById('stock-id').focus(); 
            loadInventory(); // Refresh the table
        }
    } catch (err) {
        alert("System Error: Could not update product.");
    }
});
// Initial Load
loadInventory();