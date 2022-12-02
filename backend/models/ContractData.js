const mongoose = require("mongoose");

const ContractsDataSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
  gemAvailabilityReport: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("ContractsData", ContractsDataSchema);
