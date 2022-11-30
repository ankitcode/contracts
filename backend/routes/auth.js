import express from "express";
var ldap = require("ldapjs");
var assert = require("assert");

const router = express.Router();
const User = require("../models/UserData");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "$contracts@Portal$";

// login a user using POST "/api/auth/login"
router.post("/login", async (req, res) => {
  let success = false;
  let msg = "";

  const { empNo, password } = req.body;
  try {
    // Check user in local database before ldap authentication
    let user = await UserData.findOne({ empNo });
    if (!user) {
      return res.status(400).json({
        success,
        error: "Please try to login with correct credentials",
        msg: "You are not authorized to access the portal!!!",
      });
    }

    // ldap authentication

    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
    });
    var username = empNo + "@powergrid.in";
    client.bind(username, password, function (err) {
      if (err) {
        return res.status(400).json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
        //console.log("Incorrect Credentials!");
      } else {
        const opts = {
          filter: "sAMAccountName=" + empNo,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };

        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            return res.status(400).json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
            //console.log("Incorrect Credentials!");
          }
          res.on("searchEntry", function (data) {
            //console.log("Data found", data);
            var empData = data.object;
            //var empDataJSON = JSON.parse(empData);
            //console.log(empDataJSON.name, empDataJSON.title, empDataJSON.l);
            console.log(empData);

            const data = {
              user: {
                id: user.id,
              },
              name: empData.name,
              location: empData.l,
              designation: empData.title,
              department: empData.department,
              placeOfPosting: empData.company,
            };
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            client.unbind((err) => {
              assert.ifError(err);
            });
            return res.json({ success, authToken, msg: "Login Successful!" });
          });
          res.once("error", function (error) {
            return res.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.once("end", function () {
            //console.log("All passed");
            process.exit(0);
          });
        });
      }
    });
  } catch (error) {
    //console.error(error.message);
    return res.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

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
