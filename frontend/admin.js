const API_URL = 'http://localhost:5000/api';

// --- 1. THE LOCK ---
// We use a self-invoking function to keep the logic isolated and secure
(function checkAccess() {
    const managerPin = "1234"; // Your PIN
    const userEntry = prompt("🔐 Enter Manager PIN:");

    if (userEntry !== managerPin) {
        alert("❌ Access Denied!");
        window.location.href = "index.html"; 
        return; // Stop the script immediately
    }
    
    // If we reach here, the PIN is correct
    console.log("Access Granted.");
    init();
})();

async function init() {
    await loadInventory();
    await autoFillBarcode();
}

// --- 2. THE REST OF YOUR FUNCTIONS ---

async function autoFillBarcode() {
    try {
        const res = await fetch(`${API_URL}/products/next-barcode`);
        const data = await res.json();
        if(data.nextBarcode) {
            document.getElementById('new-barcode').value = data.nextBarcode;
        }
    } catch (err) {
        console.error("Barcode fetch failed", err);
    }
}

// --- LOAD INVENTORY TABLE ---
async function loadInventory() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        const body = document.getElementById('inventory-body');
        
        body.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td style="font-weight: bold;">${p.name}</td> <td>${p.category || 'General'}</td>
                <td>${p.barcode}</td> <td>₦${parseFloat(p.price).toLocaleString()}</td>
                <td class="${p.stock_quantity < 10 ? 'low-stock' : ''}">${p.stock_quantity}</td>
                <td><button onclick="deleteProduct(${p.id})" style="background:none; border:none; cursor:pointer;">🗑️</button></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Table load failed", err);
    }
}

// --- 3. EVENT LISTENERS ---

// Add New Product
document.getElementById('add-product-btn').addEventListener('click', async () => {
    const payload = {
        name: document.getElementById('new-name').value,
        barcode: document.getElementById('new-barcode').value,
        category: document.getElementById('new-category').value,
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
        await loadInventory();
        await autoFillBarcode();
        document.getElementById('new-name').value = '';
        document.getElementById('new-price').value = '';
    }
});

// Master Update
document.getElementById('master-update-btn').addEventListener('click', async () => {
    const id = document.getElementById('stock-id').value;
    if (!id) return alert("Please enter a Product ID");

    const payload = {
        id: parseInt(id),
        name: document.getElementById('stock-name').value.trim() || null,
        category: document.getElementById('stock-category').value || null,
        quantity: parseInt(document.getElementById('stock-qty').value) || 0,
        price: document.getElementById('stock-price').value ? parseFloat(document.getElementById('stock-price').value) : null
    };

    const res = await fetch(`${API_URL}/products/update-product`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("✅ Updated");
        await loadInventory();
        ['stock-id', 'stock-name', 'stock-qty', 'stock-price'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('stock-category').value = "";
    }
});

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("🗑️ Product removed.");
            loadInventory();
        }
    } catch (err) {
        alert("Failed to delete product.");
    }
}