var mongoose = require('mongoose');

var House = mongoose.model('House', {
    location: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        trim: true
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    },
    imageName: {
        type: String,
        required: false,
        trim: true
    },
    imageLocation: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = {
    House
};