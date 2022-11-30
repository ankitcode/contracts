var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");

const SoPPortalDataSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  location: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maintenanceDate: {
    type: Date,
    required: true,
  },
  shutdown: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  shutdownType: {
    occ: {
      type: String,
    },
    postOcc: {
      type: String,
    },
    emergency: {
      type: String,
    },
  },
  workDetails: {
    risks: {
      type: String,
      required: true,
    },
    mitigation: {
      type: String,
      required: true,
    },
  },
  shutdownElement: {
    type: String,
    required: true,
  },
  premises: {
    powergrid: {
      type: String,
    },
    other: {
      type: String,
    },
  },
  shutdownWorkScope: {
    powergrid: {
      type: String,
    },
    other: {
      type: String,
    },
  },
  shutdownRequisite: {
    ptw: {
      type: String,
    },
    ppe: {
      type: String,
    },
    pep: {
      type: String,
    },
    presence: {
      type: String,
    },
  },
  isolationSequence: {
    type: String,
    required: true,
  },
  esCloseOperationSequence: {
    type: String,
    required: true,
  },
  restorationSequence: {
    type: String,
    required: true,
  },
  esOpenOperationSequence: {
    type: String,
    required: true,
  },
  presenceOfEmp: {
    maintenanceHead: {
      type: String,
    },
    stationInCharge: {
      type: String,
    },
    alternate: {
      type: String,
    },
  },
  additionalSupervision: {
    type: String,
  },
  rtamcCheck: {
    type: String,
    required: true,
  },
  siteCheck: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  otherInfo: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  sentDetails: [
    {
      remarks: {
        type: String,
      },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
      },
      sentTo: {
        type: mongoose.Schema.Types.ObjectId,
      },
      sentOn: {
        type: Date,
      },
    },
  ],
  sentStatus: {
    type: Boolean,
    default: false,
  },
  currentlyWith: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

autoIncrement.initialize(mongoose.connection);
SoPPortalDataSchema.plugin(autoIncrement.plugin, {
  model: "SoPPortalData",
  field: "sopID",
  startAt: 1000,
  incrementBy: 100,
});

const SoPPortalData = mongoose.model("SoPPortalData", SoPPortalDataSchema);
SoPPortalData.createIndexes();

module.exports = SoPPortalData;
