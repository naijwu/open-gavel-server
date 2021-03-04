// Contrast to Staff model, the committee holds committee-specific information (to not bload the staff account)
const mongoose = require('mongoose');

// for reference to POST
// statistics: {
//     mod_no
//     mod_minutes
//     unmod_no
//     unmod_minutes
//     primary_no
//     primary_minutees
//     secondary_no
//     secondary_minutes
// },
// countries: [
//     {
//         name: '',
//         country_code: '',
//         presence: ''
//         country_flag_base: '',
//         stats_moderated:
//         stats_unmoderated: '',
//         stats_primary: '',
//         stats_secondary: '',
//     },
//     ...
// ]

const committeeSchema = new mongoose.Schema({
    statistics: {
        type: Map,
        of: String
    },
    countries: [{
        name: String,
        country_code: String,
        presence: String,
        country_flag_base: String, // base64 of custom delegation flag (field doesnt exist for UN countries)
        stats_moderated: String,
        stats_unmoderated: String,
        stats_primary: String,
        stats_secondary: String
    }],
    settings: {
        type: Map,
        of: String
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Committee', committeeSchema);