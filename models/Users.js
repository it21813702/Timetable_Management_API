//import mongoose
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,

    },  

  password: {
    type: String,
    minlength: 7,
    required: true,

    },

  role: { 
    type: String, 
    enum: ['Admin', 'Faculty', 'Student'], //for data integrity
    default: 'Student'
    },

});

//export user model
module.exports = mongoose.model('User', userSchema);

