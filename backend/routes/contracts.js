const express = require("express");
const multer = require("multer");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Contracts = require("../models/ContractData");


// Get contracts data using GET "/api/contracts/getContracts". Login required
router.post("/getContracts", fetchuser, async (req, res) => {
  let success = false;
  try {
    //console.log(req.isAdmin);
    if (!req.isAdmin) {
      const contractsData = await Contracts.find({
        createdBy: req.id,
      });
      success = true;
      return res.status(200).json({
        success,
        contractsData,
      });
    } else {
      //console.log(req.isAdmin);
      const contractsData = await Contracts.find();
      success = true;
      return res.status(200).json({
        success,
        contractsData,
      });
    }
  } catch (error) {
    //console.error(error.message);
    res.json({
      msg: "Internal server error!",
      error: "Internal server error!",
      success,
    });
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "../public/loaFiles");
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "-" + Date.now() + ".pdf");
    },
  }),
}).single("loaCopy");

// Add new contract data using POST "/api/contracts/addContractsData". Login required
router.post("/addContractsData", fetchuser, upload, async (req, res) => {
  //console.log(req.data, req.file);
  let success = false;
  try {
    const {
      packageName,
      dateAwarded,
      amount,
      natureOfProcurement,
      throughGeM,
      gemMode,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
      availabilityReport,
    } = req.data;
    //console.log(req.file);
    //console.log(req.location);
    const contractsData = new Contracts({
      createdBy: req.id,
      location: req.location,
      packageName,
      loa: req.file,
      awardedOn: dateAwarded,
      value: amount,
      procurementNature: natureOfProcurement,
      throughGeM,
      gemMode,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
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

// Delete Contracts Data using DELETE "/api/contracts/deleteContractsData". Login required
router.post("/deleteContractsData", fetchuser, async (req, res) => {
  let success = false;
  try {
    let contractsData = await Contracts.findById(req.body.id);
    if (!contractsData) {
      return res.json({
        msg: "Contract Not Found!",
        error: "Contract Not Found!",
        success,
      });
    }

    contractsData = await Contracts.findByIdAndDelete(req.body.id);
    success = true;
    return res.json({ msg: "Contract Data has been deleted", success });
  } catch (error) {
    //console.error(error.message);
    res.json({
      msg: "Internal server error!",
      error: "Internal server error!",
      success,
    });
  }
});

module.exports = router;
