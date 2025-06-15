// Initialize Stripe
const stripe = Stripe('pk_test_51RKD21P9qZgjYkfAejJUC9B5u1Nvlu9zhisqGxIxBJB3fSN4uasW8zudZnfeQ6gazs6pMWgy4EltOue2oBJXG7Tq00ZZZs84pm');

// Initialize EmailJS
emailjs.init("Pt6UnkBEsJUrO_8Yi");

// Display cart items on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    setupPayButton();
});

// Display cart items in the checkout summary
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsList.innerHTML = '';

    const imageMap = {
        "Mango Mochi": "mango-mochi.png",
        "Strawberry Mochi": "strawberry-mochi.png",
        "Matcha Mochi": "matcha-mochi.png",
        "Hokey Pokey Mochi": "hockey-pockey-mochi.png",
        "Surprise Mochi": "anything-mochi.png"
    };

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.quantity * 5; // Fixed price
        total += itemTotal;

        const li = document.createElement('li');
        li.classList.add('cart-item');

        const itemImage = document.createElement('img');
        itemImage.src = imageMap[item.name] || 'placeholder.png';
        itemImage.alt = item.name;
        itemImage.classList.add('cart-item-image');

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('cart-item-info');
        itemInfo.innerHTML = `
            <p>${item.name}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${itemTotal.toFixed(2)}</p>
        `;

        li.appendChild(itemImage);
        li.appendChild(itemInfo);
        cartItemsList.appendChild(li);
    });

    const totalLi = document.createElement('li');
    totalLi.style.fontWeight = 'bold';
    totalLi.style.marginTop = '10px';
    totalLi.innerHTML = `Total: $${total.toFixed(2)}`;
    cartItemsList.appendChild(totalLi);
}

//Email Function Commented Out Till Further Improved Payment Method Applied

// // Setup pay button click handler
// function setupPayButton() {
//     const payButton = document.getElementById("pay-button");
//     if (!payButton) return;

//     payButton.addEventListener("click", async () => {
//         const form = document.getElementById("checkout-form");
//         const cart = JSON.parse(localStorage.getItem("cart")) || [];

//         if (cart.length === 0) {
//             alert("Your cart is empty.");
//             return;
//         }

//         const name = form.name.value;
//         const email = form.email.value;
//         const phone = form.phone.value;
//         const address = form.address.value;
//         const receiveOffers = form['receive-offers'].checked;

//         // Save email for promotional offers
//         savePromotionalEmail(email, receiveOffers);

//         // Generate cart summary string
//         const cartSummary = cart.map(item =>
//             `${item.name} x${item.quantity} = $${(item.quantity * 5).toFixed(2)}`
//         ).join('\n');

//         const total = cart.reduce((sum, item) => sum + item.quantity * 5, 0).toFixed(2);

//         // Email parameters
//         const adminEmailParams = {
//             name,
//             email,
//             phone,
//             address,
//             receive_offers: receiveOffers ? "Yes" : "No",
//             cart: cartSummary,
//             total
//         };

//         const customerEmailParams = {
//             to_email: email,
//             name,
//             cart: cartSummary,
//             total
//         };

//         try {
//             // Send emails
//             await emailjs.send("munchimochi", "template_c7oaodh", adminEmailParams);
//             await emailjs.send("munchimochi", "template_q02b76n", customerEmailParams);

//             // Clear cart and redirect
//             localStorage.removeItem("cart");
//             window.location.href = "success.html";

//         } catch (error) {
//             console.error("EmailJS error:", error);
//             alert("Failed to send confirmation. Please try again.");
//         }
//     });
// }

// Save email to localStorage if opted in for promotions
function savePromotionalEmail(email, consent) {
    if (consent && email) {
        const promotionalEmails = JSON.parse(localStorage.getItem('promotionalEmails')) || [];
        if (!promotionalEmails.includes(email)) {
            promotionalEmails.push(email);
            localStorage.setItem('promotionalEmails', JSON.stringify(promotionalEmails));
            console.log('Email saved for promotions:', email);
        }
    }
}
