const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect("mongodb://10.117.0.6:27017/contractsData", () => {
    console.log("Connected to MongoDB Successfully!!!");
  });
};

module.exports = connectToMongo;
