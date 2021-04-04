const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
        max: 100
    },
    email:{
        type: String,
        required: true,
        max: 100
    },
    donationAmount: {
        type: Number,
        required: true,
        max: 100
    }
})

module.exports = mongoose.model('PaymentSchema', PaymentSchema)