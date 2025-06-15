document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mochiSurvey');
    const progressBar = document.getElementById('progressBar');
    const inputs = form.querySelectorAll('input, select');
    const cartCountElement = document.querySelector('.cart-count');

    // Function to update cart count from localStorage
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = totalItems;
    };

    // Initial cart count update
    updateCartCount();

    // Add event listener for storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });

    // Function to update progress bar as the user fills in the form
    const updateProgress = () => {
        const filled = Array.from(inputs).filter(input => input.value.trim() !== '').length;
        const percent = Math.round((filled / inputs.length) * 100);
        progressBar.style.width = `${percent}%`;
    };

    // Attach event listeners to inputs to update the progress bar
    inputs.forEach(input => input.addEventListener('input', updateProgress));

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect all form data
        const formData = new FormData(form);
        const surveyResponses = Object.fromEntries(formData);

        // Create email content with survey responses
        const emailContent = {
            to: 'brenomiranda.nz@gmail.com', // Your email
            subject: 'New Mochi Survey Response', // Subject for your email
            text: JSON.stringify(surveyResponses, null, 2) // The survey responses as plain text
        };

        try {
            // Send email using Email.js service
            await emailjs.send(
                'munchimochi', // Your Email.js service ID
                '', // No template ID, this will use custom email content
                emailContent, // The content you want to send (survey responses)
                'Pt6UnkBEsJUrO_8Yi' // Your Email.js public key
            );

            alert("Thanks for completing the survey! Your responses have been sent.");
            form.reset();
            updateProgress();
        } catch (error) {
            console.error('Error sending survey responses:', error);
            alert("There was an error submitting your survey. Please try again.");
        }
    });
});