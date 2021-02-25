// Contrast to Staff model, the committee holds committee-specific information (to not bload the staff account)
const mongoose = require('mongoose');


// {
//     statistics: {
//         moderated: {
//             number: '',
//             minutes: '',
//         },
//         unmoderated: {
//             number: '',
//             minutes: '',
//         },
//         primary: {
//             number: '',
//             minutes: '',
//         },
//         secondary: {
//             number: '',
//             minutes: '',
//         },
//     },
//     countries: [
//         {
//             name: '',
//             flag: '', // maybe convert image uploads to base64?
//             stats_moderated: '',
//             stats_unmoderaed: '',
//             stats_primary: '',
//             stats_secondary: ''
//         },
//     ],
//     custom_delegations: [
//         {
//             name: '',
//             flag: '',
//             stats_moderated: '',
//             stats_unmoderaed: '',
//             stats_primary: '',
//             stats_secondary: ''
//         }
//     ]
// }


const committeeSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 100,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Committee', committeeSchema);