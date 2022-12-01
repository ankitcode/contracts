const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  empNo: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

module.exports= mongoose.model("User", UserSchema);
