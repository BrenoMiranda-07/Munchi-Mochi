document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateCartCount();

    document.getElementById('clear-cart-btn').addEventListener('click', () => {
        clearCart();
        displayCartItems();
        updateCartSummary();
    });
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartCount', cartCount);

    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = cartCount;
}

function updateCartSummary() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = totalItems * 5;

    document.getElementById('summary-total-items').textContent = `Total Items: ${totalItems}`;
    document.getElementById('summary-total-price').textContent = `Total Price: $${totalPrice}`;
}

function clearCart() {
    localStorage.removeItem('cart');
    localStorage.setItem('cartCount', 0);
    updateCartCount();
}

function displayCartItems() {
    const cart = getCart();
    const cartItemsList = document.getElementById('cart-items-list');
    cartItemsList.innerHTML = '';

    const imageMap = {
        "Mango Mochi": "../ASSETS/mango-mochi.png",
        "Strawberry Mochi": "../ASSETS/strawberry-mochi.png",
        "Matcha Mochi": "../ASSETS/matcha-mochi.png",
        "Hokey Pokey Mochi": "../ASSETS/hockey-pockey-mochi.png",
        "Surprise Mochi": "../ASSETS/anything-mochi.png"
    };

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');

            const itemImage = document.createElement('img');
            itemImage.src = imageMap[item.name] || '/ASSETS/placeholder.png';
            itemImage.alt = item.name;
            itemImage.classList.add('cart-item-image');

            const itemInfo = document.createElement('div');
            itemInfo.classList.add('cart-item-info');
            itemInfo.innerHTML = `
                <p>${item.name}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.quantity * 5}</p>
            `;

            li.appendChild(itemImage);
            li.appendChild(itemInfo);
            cartItemsList.appendChild(li);
        });
    }

    updateCartSummary();
}