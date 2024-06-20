const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: true,
    },

    credits: {
        type: Number,
        required: true,
    },

    faculty: {
       type: String,
       required: true,
    }, 

    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]


});

module.exports = mongoose.model('Course', courseSchema);