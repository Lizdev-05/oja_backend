require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const app = express();
app.use(cors());
app.use(express.json());
// const path = require("path");

app.get("/", (req, res) => {
  res.send("Successfully connected to the server");
});

const array = [];
const calculateOrderAmount = (items) => {
  items.map((item) => {
    const { price, cartQuantity } = item;
    const countItemAmount = price * cartQuantity;
    return array.push(countItemAmount);
  });
  const totalAmount = array.reduce((a, b) => {
    return a + b;
  }, 0);
  return totalAmount * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items, shipping, description } = req.body;
  console.log(req.body.description);
  console.log(description);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    description,
    shipping: {
      name: shipping.name,
      address: {
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        postal_code: shipping.postal_code,
        country: shipping.country,
      },

      phone: shipping.phone,
    },
    // receipt_email: customerEmail,
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () =>
  console.log(`Node server listening on port 4242! ${PORT} `)
);

// npm init -y
// npm install express stripe cors
// npm install dotenv
// npm install nodemon --save-dev
