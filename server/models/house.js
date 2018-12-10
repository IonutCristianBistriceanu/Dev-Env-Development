var mongoose = require('mongoose');

var House = mongoose.model('House', {
    Location: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    CreatedAt: {
        type: Number,
        default: new Date().getTime()
    },
    Images: [{
        ImageName: {
            type: String,
            required: true,
            trim: true
        },
        ImageLocation: {
            type: String,
            required: true,
            trim: true
        }
    }]
});

module.exports = {
    House
};