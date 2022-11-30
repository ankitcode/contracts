const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const SoPPortalData = require("../models/SoPPortalData");
const User = require("../models/User");

//db.users.find({awards: {$elemMatch: {award:'National Medal', year:1975}}})

// Get SoP Sent Data using GET "/api/auth/fetchSoPSentData". Login required
router.get("/fetchSoPSentData", fetchuser, async (req, res) => {
  try {
    const sopData = await SoPPortalData.find({
      sentDetails: {$elemMatch: {sentBy: req.user.id}},
    });
    res.json(sopData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});


// Get SoP Created Data using GET "/api/auth/fetchSoPData". Login required
router.get("/fetchSoPData", fetchuser, async (req, res) => {
  try {
    const sopData = await SoPPortalData.find({
      currentlyWith: req.user.id,
    });
    res.json(sopData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Add new sop data using POST "/api/auth/addSoPData". Login required
router.post("/addSoPData", fetchuser, async (req, res) => {
  try {
    const {
      description,
      maintenanceDate,
      shutdown,
      shutdownType,
      workDetails,
      shutdownElement,
      premises,
      shutdownWorkScope,
      shutdownRequisite,
      isolationSequence,
      esCloseOperationSequence,
      restorationSequence,
      esOpenOperationSequence,
      presenceOfEmp,
      additionalSupervision,
      rtamcCheck,
      siteCheck,
      remarks,
      otherInfo,
    } = req.body;
    //console.log(req.user.id)
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    const soPPortalData = new SoPPortalData({
      user: req.user.id,
      location: user.location,
      region: user.region,
      description,
      maintenanceDate,
      shutdown,
      shutdownType,
      workDetails,
      shutdownElement,
      premises,
      shutdownWorkScope,
      shutdownRequisite,
      isolationSequence,
      esCloseOperationSequence,
      restorationSequence,
      esOpenOperationSequence,
      presenceOfEmp,
      additionalSupervision,
      rtamcCheck,
      siteCheck,
      remarks,
      otherInfo,
      currentlyWith: req.user.id,
    });
    const savedsoPPortalData = await soPPortalData.save();

    return res.json(savedsoPPortalData);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error");
  }
});

// Update sopPoratlData using: PUT "/api/sop/updateSop". Login required
router.put("/updateSop/:id", fetchuser, async (req, res) => {
  try {
    let sopData = await SoPPortalData.findById(req.params.id);
    if (!sopData) {
      return res.status(404).send("Not Found");
    }
    const {
      description,
      maintenanceDate,
      shutdown,
      shutdownType,
      workDetails,
      shutdownElement,
      premises,
      shutdownWorkScope,
      shutdownRequisite,
      isolationSequence,
      esCloseOperationSequence,
      restorationSequence,
      esOpenOperationSequence,
      presenceOfEmp,
      additionalSupervision,
      rtamcCheck,
      siteCheck,
      remarks,
      otherInfo,
    } = req.body;
    //console.log(req.user.id)
    sopData = await SoPPortalData.findByIdAndUpdate(req.params.id, {
      $set: {
        description,
        maintenanceDate,
        shutdown,
        shutdownType,
        workDetails,
        shutdownElement,
        premises,
        shutdownWorkScope,
        shutdownRequisite,
        isolationSequence,
        esCloseOperationSequence,
        restorationSequence,
        esOpenOperationSequence,
        presenceOfEmp,
        additionalSupervision,
        rtamcCheck,
        siteCheck,
        remarks,
        otherInfo,
      },
    });

    sopData = await SoPPortalData.findById(req.params.id);
    //console.log(sopData)
    res.json({ sopData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Send sopPoratlData using: PUT "/api/sop/sendSop". Login required
router.put("/sendSop/:id", fetchuser, async (req, res) => {
  try {
    let sopData = await SoPPortalData.findById(req.params.id);
    if (!sopData) {
      return res.status(404).send("Not Found");
    }
    sopData = await SoPPortalData.findByIdAndUpdate(req.params.id, {
      $push: {
        sentDetails: {
          remarks: req.body.remarks,
          sentBy: req.user.id,
          sentTo: req.body.sentTo,
          sentOn: Date.now(),
        },
      },
      $set: {
        currentlyWith: req.body.sentTo,
        sentStatus: true,
      },
    });

    sopData = await SoPPortalData.findById(req.params.id);
    //console.log(sopData)
    res.json({ sopData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Delete SoP Data using DELETE "/api/auth/deleteSoPData". Login required
router.delete("/deleteSoPData/:id", fetchuser, async (req, res) => {
  try {
    let sopData = await SoPPortalData.findById(req.params.id);
    if (!sopData) {
      return res.status(404).send("Not Found");
    }
    if (sopData.user != req.user.id) {
      return res.status(404).send("Not Allowed");
    }
    sopData = await SoPPortalData.findByIdAndDelete(req.params.id);
    res.json({ Success: "SoP Data has been deleted", sopData: sopData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
