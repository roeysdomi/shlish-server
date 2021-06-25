const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  pic: {
    type: String,
    required: true,
    unique:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Tusers = mongoose.model('tuser', UserSchema);

module.exports = Tusers;
