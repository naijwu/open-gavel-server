const mongoose = require('mongoose');

// committee
// username,
// password,
// conference,

const staffSchema = new mongoose.Schema({
    committee: {
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
    conference: {
        type: String,
        required: true,
        max: 100,
    },
    conference_id: {
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
    },
    // OGD: {
    //     preferences: { // app preferences -- to be persisted

    //     },
    //     countries: { // consists of country codes -- to be persisted
    //         AZ: { 
    //             name: String,
    //             flag: String,
    //             enabled: String,
    //             og_state: { // information relevant to OpenGavel use
    //                 presence: String, // roll call
    //                 primary_speaks: Number,
    //                 secondary_speaks: Number,
    //                 moderated_speaks: Number,
    //             }
    //         }
    //         // ...    TODO: Add rest of the countries
    //     }
    // },
});

module.exports = mongoose.model('Staff', staffSchema);