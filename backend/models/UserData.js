const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  emp_no: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  post: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  empType: {
    creator: {
      type: Boolean,
      default: false,
    },
    approver: {
      type: Boolean,
      default: false,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
