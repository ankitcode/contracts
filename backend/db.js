const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect("mongodb://localhost:27017/contractsData", () => {
    console.log("Connected to MongoDB Successfully!!!");
  });
};

module.exports = connectToMongo;
