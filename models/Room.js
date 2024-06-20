const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },

  capacity: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ['lab', 'auditorium', 'normal'],
    default: "normal",
  },

  hasProjector: {
    type: Boolean,
    default: false
  },


});

module.exports = mongoose.model('Room', roomSchema);