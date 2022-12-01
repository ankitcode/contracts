const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Contracts = require("../models/ContractData");

// Get contracts data using GET "/api/auth/getContracts". Login required
router.get("/getContracts", fetchuser, async (req, res) => {
  let success = false;
  let msg = "";
  try {
    const { id } = req.body;
    if (!res.isAdmin) {
      const contractsData = await Contracts.find({
        createdBy: id,
      });
      success = true;
      return res.status(400).json({
        success,
        contractsData,
      });
    } else {
      const contractsData = await Contracts.find();
      success = true;
      return res.status(400).json({
        success,
        contractsData,
      });
    }
  } catch (error) {
    //console.error(error.message);
    res
      .status(500)
      .json({
        msg: "Internal server error!",
        error: "Internal server error!",
        success,
      });
  }
});

// Add new contract data using POST "/api/auth/addContractsData". Login required
router.post("/addContractsData", fetchuser, async (req, res) => {
  let success = false;
  try {
    const {
      packageName,
      loa,
      awardedOn,
      value,
      procurementNature,
      throughGeM,
      gemMode,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
      gemAvailabilityReport,
    } = req.body;

    const contractsData = new Contracts({
      createdBy: req.id,
      location: req.location,
      packageName,
      loa,
      awardedOn,
      value,
      procurementNature,
      throughGeM,
      gemMode,
      reasonNotGeM,
      availableOnGeM,
      approvingOfficer,
      gemAvailabilityReport,
    });

    const savedContractsData = await contractsData.save();
    success = true;
    return res.json({ success, msg: "Saved Contracts Data!" });
  } catch (error) {
    //console.error(error.message);
    return res
      .status(500)
      .json({
        msg: "Internal server error!",
        error: "Internal server error!",
        success,
      });
  }
});

// Delete Contracts Data using DELETE "/api/auth/deleteContractsData". Login required
router.delete("/deleteContractsData/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    let contractsData = await Contracts.findById(req.params.id);
    if (!contractsData) {
      return res
        .status(404)
        .json({
          msg: "Contract Not Found!",
          error: "Contract Not Found!",
          success,
        });
    }

    contractsData = await Contracts.findByIdAndDelete(req.params.id);
    success = true;
    return res.json({ msg: "Contract Data has been deleted", success });
  } catch (error) {
    //console.error(error.message);
    res
      .status(500)
      .json({
        msg: "Internal server error!",
        error: "Internal server error!",
        success,
      });
  }
});

module.exports = router;
