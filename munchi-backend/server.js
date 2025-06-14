const express = require("express");
const stripe = require("stripe")("sk_test_51RKD21P9qZgjYkfAeJgHlxplzXohgfM3vswgrX6dgJzxKfGr4N4BCcVQVNrPOT4qwYSb3AvFKxuQaHyXCizrIKOl00xiXxMVoV"); // Replace with your Stripe secret key
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const { cartItems } = req.body;

    const line_items = cartItems.map(item => ({
        price_data: {
            currency: 'nzd',
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100, // Stripe uses cents
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: "http://localhost:4242/success.html",  // Change for your site
        cancel_url: "http://localhost:4242/checkout.html",
    });

    res.json({ id: session.id });
});

app.listen(4242, () => console.log("Server running on port 4242"));