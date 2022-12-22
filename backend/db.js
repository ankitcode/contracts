/*
 Include mongoose - Object Data Modelling (ODM) library for MongoDB
 Provides an interface to the database for creating, quering, updating, deleting records, etc. 
*/
const mongoose = require("mongoose");

// Setup connection with database
const connectToMongo = () => {
  mongoose.connect("mongodb://localhost:27017/contractsData", () => {
    console.log("Connected to MongoDB Successfully!!!");
  });
};

module.exports = connectToMongo;
