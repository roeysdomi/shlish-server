const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  company: {
    type: String,
    required: true
  },
  jobid: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true,
    unique:true
  },
  location: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true
  },

  type:{
    type: String,
    required: true,

  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', UserSchema);

module.exports = Job;
