
const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },

  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    default: "Monday"
  },

  startTime: {
    type: String,
    required: true,
  },

  endTime: {
    type: String,
    required: true,
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  }

});

module.exports = mongoose.model('ClassSession', classSessionSchema);
