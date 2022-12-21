/* Mongoose Schema for storing User Details*/

/*
 Include mongoose - Object Data Modelling (ODM) library for MongoDB
 Provides an interface to the database for creating, quering, updating, deleting records, etc. 
*/
const mongoose = require("mongoose");

// Define User Schema
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

// Mongoose model is a wrapper on the Mongoogse schema
module.exports= mongoose.model("User", UserSchema);
