const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shared: [{
        type: String,  // Email addresses of users the note is shared with
        trim: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
