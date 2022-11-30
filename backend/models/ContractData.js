import { Schema, model } from "mongoose";

const ContractsDataSchema = new Schema({
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
    type: String,
  },
  awardedOn: {
    type: Date,
    required: true,
  },
  value: {
    type: Interger,
    required: true,
  },
  procurementNature: {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  throughGeM: {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  gemMode: {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  reasonNotGeM: {
    key: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  availableOnGeM: {
    key: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  approvingOfficer: {
    type: String,
  },
  gemAvailabilityReport: {
    key: {
      type: String,
    },
    value: {
      type: String,
    },
  },
});

const ContractsData = mongoose.model("ContractsData", ContractsDataSchema);

module.exports = ContractsData;
