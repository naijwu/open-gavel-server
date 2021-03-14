const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    author: {
        type: String,
        max: 200,
    },
    title: {
        type: String,
        max: 100,
    },
    enabled: {
        type: String,
        max: 100,
    },
    content: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Article', articleSchema);