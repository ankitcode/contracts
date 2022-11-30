const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "GiveMe$$$s";

// create a user using POST "/api/auth/createuser", doesn't require Auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);
    try {
      // Check whether email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Check whether emp_no already exists
      user = await User.findOne({ emp_no: req.body.emp_no });
      //console.log(user);
      //console.log(user)
      if (user) {
        return res
          .status(400)
          .json({ error: "Employee Number already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //console.log(secPass);
      user = await User.create({
        emp_no: req.body.emp_no,
        name: req.body.name,
        email: req.body.email,
        post: req.body.post,
        region: req.body.region,
        location: req.body.location,
        password: secPass,
        empType: req.body.empType,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      //console.log(authToken);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// login a user using POST "/api/auth/login"
router.post(
  "/login",
  [
    body("emp_no", "Enter a valid Employee Number")
      .isNumeric()
      .exists(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    let msg = "";
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { emp_no, password } = req.body;
    try {
      let user = await User.findOne({ emp_no });
      if (!user) {
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!password) {
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Get loggedin user details using POST "/api/auth/getUser"
router.post("/getUser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Get all users except current user using POST "/api/auth/getAllUser". Login required
router.post("/getAllUsers", fetchuser, async (req, res) => {
  try {
    const user = await User.find(
      { _id: { $nin: [req.user.id] } },
      { _id: 1, name: 1, location: 1, post: 1, emp_no: 1 }
    );
    //console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Get User Id using POST "/api/auth/getUserId". Login required
router.post("/getUserId", fetchuser, async (req, res) => {
  try {
    const userid = await User.find(
      { emp_no: { $in: [req.body.emp_no] } },
      { _id: 1 }
    );
    //console.log(user);
    res.send(userid);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
