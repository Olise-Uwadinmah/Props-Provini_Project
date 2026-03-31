const API_URL = 'http://localhost:5000/api';

// PIN Protection
const pin = prompt("Enter Manager PIN:");
if (pin !== "1234") {
    alert("Access Denied");
    window.location.href = "index.html";
}

// Load Table
async function loadInventory() {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    const body = document.getElementById('inventory-body');
    body.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.barcode}</td>
            <td>₦${parseFloat(p.price).toLocaleString()}</td>
            <td class="${p.stock_quantity < 10 ? 'low-stock' : ''}">${p.stock_quantity}</td>
        </tr>
    `).join('');
}

// Logic for ADDING NEW PRODUCT
document.getElementById('add-product-btn').addEventListener('click', async () => {
    const payload = {
        name: document.getElementById('new-name').value,
        barcode: document.getElementById('new-barcode').value,
        price: parseFloat(document.getElementById('new-price').value),
        stock_quantity: parseInt(document.getElementById('new-stock').value) || 0
    };

    const res = await fetch(`${API_URL}/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("✅ Product Added");
        loadInventory();
        document.querySelectorAll('.admin-form input').forEach(i => i.value = '');
    }
});

// Logic for UPDATING EXISTING (Stock/Price)
async function handleUpdate() {
    const payload = {
        id: parseInt(document.getElementById('stock-id').value),
        quantity: parseInt(document.getElementById('stock-qty').value) || 0,
        price: document.getElementById('stock-price').value !== "" ? parseFloat(document.getElementById('stock-price').value) : null
    };

    const res = await fetch(`${API_URL}/products/update-product`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("✅ Updated");
        loadInventory();
        document.getElementById('stock-id').value = '';
        document.getElementById('stock-qty').value = '';
        document.getElementById('stock-price').value = '';
        document.getElementById('stock-id').focus();
    }
}

document.getElementById('restock-btn').addEventListener('click', handleUpdate);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && ['stock-id', 'stock-qty', 'stock-price'].includes(document.activeElement.id)) {
        handleUpdate();
    }
});

loadInventory();