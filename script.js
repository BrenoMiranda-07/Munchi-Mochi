document.addEventListener("DOMContentLoaded", () => {
    // Carousel Setup
    const track = document.querySelector('.carousel-track');
    const originalItems = Array.from(track.children);
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const visibleCount = 3;
    const itemWidth = 100 / visibleCount;
    let currentIndex = visibleCount;
    let isJumping = false;

    // Clone items for infinite scroll
    const cloneItems = () => {
        const clonesBefore = originalItems.slice(-visibleCount).map(el => el.cloneNode(true));
        const clonesAfter = originalItems.slice(0, visibleCount).map(el => el.cloneNode(true));
        clonesBefore.forEach(clone => track.insertBefore(clone, track.firstChild));
        clonesAfter.forEach(clone => track.appendChild(clone));
    };

    // Set item width
    const setItemWidth = () => {
        const allItems = Array.from(track.querySelectorAll('.carousel-item'));
        allItems.forEach(item => item.style.flex = `0 0 ${itemWidth}%`);
    };

    // Update active slide
    const updateActive = () => {
        const allItems = Array.from(track.children);
        allItems.forEach(item => item.classList.remove('active'));
        const middleIndex = currentIndex + 1;
        if (allItems[middleIndex]) {
            allItems[middleIndex].classList.add('active');
        }
    };

    // Move to a new slide
    const moveTo = (index, animate = true) => {
        track.style.transition = animate ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(-${itemWidth * index}%)`;
        currentIndex = index;
        updateActive();
    };

    // Handle looping at the ends
    const handleLooping = () => {
        const allItems = Array.from(track.children);

        if (currentIndex >= allItems.length - visibleCount) {
            isJumping = true;
            track.style.transition = 'none';
            currentIndex = visibleCount;
            track.style.transform = `translateX(-${itemWidth * currentIndex}%)`;
            resetLoop();
        }

        if (currentIndex < visibleCount) {
            isJumping = true;
            track.style.transition = 'none';
            currentIndex = allItems.length - visibleCount * 2;
            track.style.transform = `translateX(-${itemWidth * currentIndex}%)`;
            resetLoop();
        }
    };

    // Reset looping after transition
    const resetLoop = () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.5s ease';
                isJumping = false;
                updateActive();
            });
        });
    };

    // Slide movement functions
    const nextSlide = () => !isJumping && moveTo(currentIndex + 1);
    const prevSlide = () => !isJumping && moveTo(currentIndex - 1);

    // Initialize carousel
    const initCarousel = () => {
        cloneItems();
        setItemWidth();
        moveTo(currentIndex, false);
    };

    // Event listeners for navigation
    track.addEventListener('transitionend', handleLooping);
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    initCarousel();

    // Cart Setup
    const cartCountEl = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const initialCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cartCount', initialCount);
    if (cartCountEl) cartCountEl.textContent = initialCount;

    // Add to Cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const notification = createNotification();

    // Button click event for adding to cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const mochiName = getCurrentMochiName();
            addToCart(mochiName);
            animateButton(addToCartBtn);
            showNotification(notification, `${mochiName} added to cart!`);
        });
    }

    // Get current mochi name
    function getCurrentMochiName() {
        const activeItem = document.querySelector('.carousel-item.active');
        return activeItem?.dataset.mochi || 'Mochi';
    }

    // Add mochi to cart
    function addToCart(mochiName) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.name === mochiName);

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ name: mochiName, quantity: 1, price: 5 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Update cart count and badge
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('cartCount', cartCount);
        if (cartCountEl) cartCountEl.textContent = cartCount;
    }

    // Create notification element
    function createNotification() {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
        return notification;
    }

    // Show notification popup
    function showNotification(notification, message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Animate Add to Cart button
    function animateButton(button) {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 300);
    }

    // Style injection
    injectStyles();
});

// Inject styles for notifications and button animation
function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .add-to-cart-btn.clicked {
            transform: scale(1.1);
            transition: transform 0.2s ease;
        }
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #E54E6D;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 999;
        }
        .notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}