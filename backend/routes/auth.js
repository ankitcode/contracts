import express from "express";
import UserData from "../models/UserData";
var ldap = require("ldapjs");
var assert = require("assert");

const router = express.Router();
const User = require("../models/UserData");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser").default;
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
            client.unbind((err) => {
              assert.ifError(err);
            });
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
                isAdmin: user.isAdmin,
                empNo: empNo,
                password: password,
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
            return res.json({ success, authToken, msg: "Login Successful !" });
          });
          res.once("error", function (error) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return res.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.once("end", function () {
            client.unbind((err) => {
              assert.ifError(err);
            });
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

// add a user using POST "/api/auth/addUser". Authentication required
router.post("/addUser", fetchuser, async (req, res) => {
  //console.log(req.body);
  let success = false;
  let msg = "";
  try {
    // Check whether employee already exists
    let user = await UserData.findOne({ empNo: req.body.empNo });
    if (user) {
      return res.status(400).json({
        error: "Employee already exists!",
        success,
        msg: "Employee already exists!",
      });
    }
    // Check for admin login
    if (!res.isAdmin) {
      return res.status(400).json({
        error: "Admin Authentication Required!",
        success,
        msg: "Admin Authentication Required!",
      });
    }

    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
    });
    var username = res.empNo + "@powergrid.in";
    client.bind(username, res.password, function (err) {
      if (err) {
        return res.status(400).json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
        //console.log("Incorrect Credentials!");
      } else {
        const opts = {
          filter: "sAMAccountName=" + res.empNo,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };

        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return res.status(400).json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
            //console.log("Incorrect Credentials!");
          }
          res.on("searchEntry", async function (data) {
            //console.log("Data found", data);
            var empData = data.object;
            //var empDataJSON = JSON.parse(empData);
            //console.log(empDataJSON.name, empDataJSON.title, empDataJSON.l);
            //console.log(empData);
            user = await UserData.create({
              empNo: emp_no,
              name: empData.name,
              location: empData.l,
              department: empData.department,
              post: empData.title,
            });
            //const authToken = jwt.sign(data, JWT_SECRET);
            //console.log(authToken);
            success = true;
            client.unbind((err) => {
              assert.ifError(err);
            });
            return res.json({ success, msg: "Employee Added!" });
          });
          res.once("error", function (error) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return res.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.once("end", function () {
            client.unbind((err) => {
              assert.ifError(err);
            });
            //console.log("All passed");
            process.exit(0);
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

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
