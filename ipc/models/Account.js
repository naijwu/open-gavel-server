const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 100,
    },
    username: {
        type: String,
        max: 100,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Account', accountSchema);