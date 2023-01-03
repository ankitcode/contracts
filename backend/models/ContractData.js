/* Mongoose Schema for storing contracts data */

/*
 Include mongoose - Object Data Modelling (ODM) library for MongoDB
 Provides an interface to the database for creating, quering, updating, deleting records, etc. 
*/
const mongoose = require("mongoose");
const { boolean } = require("yup");

// Define ContractsData Schema
const ContractsDataSchema = new mongoose.Schema({
  // Reference UserDataSchema - storing ObjectID of User who added contract data
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdByDetails: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  packageName: {
    type: String,
    required: true,
  },
  loa: {
    type: Object,
  },
  awardedOn: {
    type: Date,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  procurementNature: {
    type: Object,
    required: true,
  },
  throughGeM: {
    type: Object,
    required: true,
  },
  gemMode: {
    type: Object,
    required: true,
  },
  msmeVendor: {
    type: Object,
    required: true,
  },
  msmeCertificate: {
    type: Object,
  },
  msmeType: {
    type: Object,
    required: true,
  },
  reasonNotGeM: {
    type: Object,
    required: true,
  },
  availableOnGeM: {
    type: Object,
    required: true,
  },
  approvingOfficer: {
    type: String,
  },
  approval: {
    type: Object,
  },
  gemAvailabilityReport: {
    type: Object,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deletedByDetails: {
    type: String,
  },
});

// Mongoose model is a wrapper on the Mongoogse schema
module.exports = mongoose.model("ContractsData", ContractsDataSchema);
