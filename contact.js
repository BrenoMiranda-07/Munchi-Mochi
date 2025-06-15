document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.querySelector('.cart-count');

    // Function to update the cart icon count based on localStorage
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = totalItems;
    };

    // Initial update
    updateCartCount();

    // Update if cart changes from another tab
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
});

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm('munchimochi', 'template_c7oaodh', this)
        .then(function () {
            alert('Message sent! Thank you for contacting us.');
            document.getElementById('contact-form').reset();
        }, function (error) {
            alert('Failed to send message. Please try again later.');
            console.error('EmailJS error:', error);
        });
});