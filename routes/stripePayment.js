const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);



const donationAmount = userInputedAmount => {
//User input for donation amount will be here
//boilerplate code for now to charge $15.00
return 15
}


router.post("/payments", async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: donationAmount(userInputedAmount),
        currency: "cad"
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

module.exports = router;