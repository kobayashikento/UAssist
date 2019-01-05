// Here we define the models which is the structure of the "objects" we will store
// in the database.

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//A time
const TimeSchema = new mongoose.Schema({
  start_time: {
    type: Number,
    required: true,
  },
  end_time: {
    type: Number,
    required: true,
  },
})

// A room
const RoomSchema = new mongoose.Schema({
  building_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  room_number: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  times: []
})

const Room = mongoose.model("Room", RoomSchema);
module.exports = {Room};
