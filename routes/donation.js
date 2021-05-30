const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentRecords = require('../models/PaymentRecords')



router.post("/payment-intent", async (req, res) => {
    const newPaymentRecord = new PaymentRecords({
        donationAmount: req.body.donationAmount * 100,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    })

    var paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.donationAmount * 100,
        currency: "cad"
    })

    try{
        const newDonation = await newPaymentRecord.save();
        res.status(200).json(newDonation)
        res.send({
            clientSecret: paymentIntent.client_secret
        })
    } catch(err){
        res.status(400).json({
            message: err.message,
        });
    }
});

module.exports = router;