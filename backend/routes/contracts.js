/*
APIs for contracts data
*/

// Imports
const express = require("express");
const multer = require("multer");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Contracts = require("../models/ContractData");
// Import for removing file
var fs = require("fs");

// Get contracts data using POST "/api/contracts/getContracts". Login required
router.post("/getContracts", fetchuser, async (req, res) => {
  let success = false;
  try {
    if (!req.isAdmin) {
      // If request is not from admin, return contracts added by them only
      const contractsData = await Contracts.find({
        createdBy: req.id,
      });
      success = true;
      return res.status(200).json({
        success,
        contractsData,
      });
    } else {
      // If request id from admin, return all data
      const contractsData = await Contracts.find();
      success = true;
      return res.status(200).json({
        success,
        contractsData,
      });
    }
  } catch (error) {
    res.json({
      msg: "Internal server error!",
      error: "Internal server error!",
      success,
    });
  }
});

// Function for uploading files
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callback) {
      if (file.fieldname == "loaCopy") {
        callback(null, "./public/Files/loaFiles");
      } else {
        if (file.fieldname == "approvalCopy") {
          callback(null, "./public/Files/approvalFiles");
        } else {
          if (file.fieldname == "msmeCertificateFile") {
            callback(null, "./public/Files/MSMECertificateFiles");
          }
        }
      }
    },
    filename: function(req, file, callback) {
      callback(null, file.fieldname + "-" + Date.now() + ".pdf");
    },
  }),
}).fields([
  { name: "loaCopy", maxCount: 1 },
  { name: "msmeCertificateFile", maxCount: 1 },
  { name: "approvalCopy", maxCount: 1 },
]);

// Add new contract data using POST "/api/contracts/addContractsData". Login required
router.post("/addContractsData", fetchuser, upload, async (req, res) => {
  let success = false;
  try {
    const {
      packageName,
      dateAwarded,
      amount,
      natureOfProcurement,
      throughGeM,
      gemMode,
      msmeVendor,
      msmeType,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
      availabilityReport,
    } = req.data;

    let loaCopy = null;
    if ("loaCopy" in req.files) loaCopy = req.files["loaCopy"][0];

    let approvalCopy = null;
    if ("approvalCopy" in req.files)
      approvalCopy = req.files["approvalCopy"][0];

    let msmeCertificateFile = null;
    if ("msmeCertificateFile" in req.files)
      msmeCertificateFile = req.files["msmeCertificateFile"][0];

    const contractsData = new Contracts({
      createdBy: req.id,
      createdByDetails: "",
      location: req.location,
      packageName,
      loa: loaCopy,
      awardedOn: dateAwarded,
      value: amount,
      procurementNature: natureOfProcurement,
      throughGeM,
      gemMode,
      msmeVendor,
      msmeCertificate: msmeCertificateFile,
      msmeType,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
      approval: approvalCopy,
      gemAvailabilityReport: availabilityReport,
    });

    const savedContractsData = await contractsData.save();
    success = true;
    return res.json({
      success,
      msg: "Saved Contracts Data!",
      savedContractsData,
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      msg: "Internal server error!",
      error: "Internal server error!",
      success,
    });
  }
});

// Delete multiple files
function deleteFiles(files, callback) {
  var i = files.length;
  files.forEach(function(filepath) {
    fs.unlink(filepath, function(err) {
      i--;
      if (err) {
        callback(err);
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

// Update Contracts Data using PUT "/api/contracts/updateContractsData". Login required
router.put("/updateContractsData/:id", fetchuser, upload, async (req, res) => {
  let success = false;
  try {
    const {
      packageName,
      dateAwarded,
      amount,
      natureOfProcurement,
      throughGeM,
      gemMode,
      msmeVendor,
      msmeType,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
      availabilityReport,
    } = req.data;

    let contracts = await Contracts.findOne({ _id: req.params.id });
    if (!contracts) {
      return response.json({
        error: "Contract data does not exists!",
        success,
        msg: "Contract data does not exists!",
      });
    }

    // deleting and updating files on updation if new file uploaded
    let loaCopy = contracts.loa;
    let loaFilename = "dummy";
    if ("loaCopy" in req.files) {
      loaCopy = req.files["loaCopy"][0];
      if (contracts.loa) loaFilename = contracts.loa.filename;
    }
    let msmeCertificateFile = contracts.msmeCertificate;
    let msmeCertificateFileName = "dummy";
    if ("msmeCertificateFile" in req.files) {
      msmeCertificateFile = req.files["msmeCertificateFile"][0];
      if (contracts.msmeCertificate)
        msmeCertificateFileName = contracts.msmeCertificate.filename;
    }
    let approvalCopy = contracts.approval;
    let approvalFilename = "dummy";
    if ("approvalCopy" in req.files) {
      approvalCopy = req.files["approvalCopy"][0];
      if (contracts.approval) approvalFilename = contracts.approval.filename;
    }

    if (throughGeM.value == "yes") {
      approvalCopy = null;
      if (contracts.approval) approvalFilename = contracts.approval.filename;
    }

    if (msmeVendor.value == "no") {
      msmeCertificateFile = null;
      if (contracts.msmeCertificate) msmeCertificateFileName = contracts.msmeCertificate.filename;
    }

    var files = [
      "D:\\Portals\\contracts\\public\\Files\\loaFiles\\" + loaFilename,
      "D:\\Portals\\contracts\\public\\Files\\approvalFiles\\" +
        approvalFilename,
      "D:\\Portals\\contracts\\public\\Files\\MSMECertificateFiles\\" +
        msmeCertificateFileName,
    ];
    deleteFiles(files, function(err) {
      if (err) {
      } else {
      }
    });

    // Updating contracts data
    const updatedContracts = await Contracts.findOneAndUpdate(
      { _id: req.params.id },
      {
        packageName,
        loa: loaCopy,
        awardedOn: dateAwarded,
        value: amount,
        procurementNature: natureOfProcurement,
        throughGeM,
        gemMode,
        msmeVendor,
        msmeCertificate: msmeCertificateFile,
        msmeType,
        reasonNotGeM,
        availableOnGeM,
        approvingOfficer,
        approval: approvalCopy,
        gemAvailabilityReport: availabilityReport,
      },
      { new: true }
    );

    success = true;
    return res.json({
      success,
      msg: "Updated Contracts Data!",
      updatedContracts,
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      msg: "Internal Server Error!",
      error: "Internal Server Error!",
      success,
    });
  }
});

// Delete Contracts Data using POST "/api/contracts/deleteContractsData". Login required
router.post("/deleteContractsData", fetchuser, async (req, res) => {
  let success = false;
  try {
    // Check for admin login
    if (!req.isAdmin) {
      return response.json({
        error: "Admin Authentication Required!",
        success,
        msg: "Admin Authentication Required!",
      });
    }

    let contractsData = await Contracts.findById(req.body.id);
    if (!contractsData) {
      return res.json({
        msg: "Contract Not Found!",
        error: "Contract Not Found!",
        success,
      });
    }

    let loaFilename = "dummy";
    if (contractsData.loa) loaFilename = contractsData.loa.filename;
    let approvalFilename = "dummy";
    if (contractsData.approval)
      approvalFilename = contractsData.approval.filename;
    let msmeCertificateFileName = "dummy";
    if (contractsData.msmeCertificate)
      msmeCertificateFileName = contractsData.msmeCertificate.filename;
    var files = [
      "D:\\Portals\\contracts\\public\\Files\\loaFiles\\" + loaFilename,
      "D:\\Portals\\contracts\\public\\Files\\approvalFiles\\" +
        approvalFilename,
      "D:\\Portals\\contracts\\public\\Files\\MSMECertificateFiles\\" +
        msmeCertificateFileName,
    ];
    deleteFiles(files, function(err) {
      if (err) {
      } else {
      }
    });
    contractsData = await Contracts.findByIdAndDelete(req.body.id);
    success = true;
    return res.json({ msg: "Contract Data has been deleted", success });
  } catch (error) {
    res.json({
      msg: "Internal server error!",
      error: "Internal server error!",
      success,
    });
  }
});

module.exports = router;
