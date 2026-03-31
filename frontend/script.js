const API_URL = 'http://localhost:5000/api';
let cart = [];

// 1. Check Server Status
async function checkStatus() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) document.getElementById('server-status').innerText = "✅ Online";
    } catch {
        document.getElementById('server-status').innerText = "❌ Offline";
    }
}
checkStatus();

// 2. Add Product Logic (Handles "12*Barcode" or standard entry)
document.getElementById('barcode-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let input = e.target.value;
        let qty = 1;

        // Bulk Multiplier Support (e.g., typing 12*1001)
        if (input.includes('*')) {
            const parts = input.split('*');
            qty = parseInt(parts[0]) || 1;
            input = parts[1]; // The actual barcode
        }
        
        addProductToCart(input, qty);
    }
});

async function addProductToCart(barcode, qty) {
    try {
        const response = await fetch(`${API_URL}/products/${barcode}`);
        if (!response.ok) throw new Error('Product not found');

        const product = await response.json();
        
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push({ ...product, quantity: qty });
        }
        
        document.getElementById('barcode-input').value = '';
        renderCart();
    } catch (err) {
        alert(err.message);
        document.getElementById('barcode-input').value = '';
    }
}

// 3. Render Cart with Naira and 7.5% VAT
function renderCart() {
    const body = document.getElementById('cart-body');
    body.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        body.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>₦${parseFloat(item.price).toLocaleString()}</td>
                <td>${item.quantity}</td>
                <td>₦${itemTotal.toLocaleString()}</td>
                <td><button onclick="removeItem(${index})" style="background:#ff4b2b; color:white; border:none; padding:5px 10px; cursor:pointer;">X</button></td>
            </tr>`;
    });

    const tax = subtotal * 0.075; 
    const total = subtotal + tax;

    document.getElementById('subtotal').innerText = subtotal.toLocaleString();
    document.getElementById('tax').innerText = tax.toLocaleString();
    document.getElementById('total').innerText = total.toLocaleString();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// 4. Checkout & Print Receipt
document.getElementById('checkout-btn').addEventListener('click', async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    const saleData = {
        total_amount: parseFloat(document.getElementById('total').innerText.replace(/,/g, '')),
        tax_amount: parseFloat(document.getElementById('tax').innerText.replace(/,/g, '')),
        payment_method: "Cash",
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price
        }))
    };

    try {
        const response = await fetch(`${API_URL}/sales/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (response.ok) {
            // Fill Receipt
            document.getElementById('r-tax').innerText = saleData.tax_amount.toLocaleString();
            document.getElementById('r-total').innerText = saleData.total_amount.toLocaleString();
            const rList = document.getElementById('receipt-items-list');
            rList.innerHTML = cart.map(i => `<tr><td>${i.name}</td><td align="center">${i.quantity}</td><td align="right">₦${(i.price * i.quantity).toLocaleString()}</td></tr>`).join('');

            // Print
            const content = document.getElementById('receipt-print-area').innerHTML;
            const old = document.body.innerHTML;
            document.body.innerHTML = content;
            window.print();
            document.body.innerHTML = old;
            window.location.reload(); 
        } else {
            alert("Checkout Failed!");
        }
    } catch (err) {
        console.error(err);
    }
});