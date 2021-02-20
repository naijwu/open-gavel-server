const mongoose = require('mongoose');

// username,
// password,
// conference,

const staffSchema = new mongoose.Schema({
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
    conference: {
        type: String,
        required: true,
        max: 100,
    },
    type: {
        type: String,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Staff', staffSchema);