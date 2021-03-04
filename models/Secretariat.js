const mongoose = require('mongoose');

// firstName,
// lastName,
// email,
// password,
// conference,

const secretariatSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 100,
    },
    lastName: {
        type: String,
        required: true,
        max: 100,
    },
    email: {
        type: String,
        max: 100,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    conferenceFullName: {
        type: String,
        required: true,
        max: 100,
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

module.exports = mongoose.model('Secretariat', secretariatSchema);