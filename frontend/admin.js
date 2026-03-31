const API_URL = 'http://localhost:5000/api';

// 1. PIN Protection
const pin = prompt("Enter Manager PIN to access Inventory:");
if (pin !== "1234") {
    alert("Unauthorized Access!");
    window.location.href = "index.html";
}

// 2. Load Inventory Table
async function loadInventory() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const tableBody = document.getElementById('inventory-body');
        tableBody.innerHTML = ''; 

        products.forEach(p => {
            const stockClass = p.stock_quantity < 10 ? 'low-stock' : '';
            const stockText = p.stock_quantity < 10 ? `${p.stock_quantity} (Low!)` : p.stock_quantity;

            tableBody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.barcode}</td>
                    <td>₦${parseFloat(p.price).toLocaleString()}</td>
                    <td class="${stockClass}">${stockText}</td>
                </tr>`;
        });
    } catch (err) {
        console.error("Failed to load inventory:", err);
    }
}

// 3. Single Update Function
async function handleUpdate() {
    const id = document.getElementById('stock-id').value;
    const qty = document.getElementById('stock-qty').value;
    const price = document.getElementById('stock-price').value;

    if (!id) return alert("Please enter a Product ID");

    const payload = {
        id: parseInt(id),
        quantity: qty ? parseInt(qty) : 0,
        price: price !== "" ? parseFloat(price) : null
    };

    try {
        const response = await fetch(`${API_URL}/products/update-product`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("✅ Update Successful!");
            loadInventory(); 
            // Clear and refocus
            document.getElementById('stock-id').value = '';
            document.getElementById('stock-qty').value = '';
            document.getElementById('stock-price').value = '';
            document.getElementById('stock-id').focus();
        } else {
            alert("Update failed. Check Product ID.");
        }
    } catch (err) {
        alert("System Error: " + err.message);
    }
}

// 4. Event Listeners
document.getElementById('restock-btn').addEventListener('click', handleUpdate);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const active = document.activeElement;
        if (active.id === 'stock-id' || active.id === 'stock-qty' || active.id === 'stock-price') {
            handleUpdate();
        }
    }
});

// Initial Load
loadInventory();