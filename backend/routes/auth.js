/*
APIs for login and user details
*/

// Imports
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

var ldap = require("ldapjs");

const User = require("../models/UserData");
var jwt = require("jsonwebtoken");

// Secret Key for auth-token
const JWT_SECRET = "$contracts@Portal$";

// login a user using POST "/api/auth/login"
router.post("/login", async (req, response) => {
  let success = false;
  const { empNo, password } = req.body;
  try {
    // Check user in local database before ldap authentication
    let user = await User.findOne({ empNo });
    if (!user) {
      return response.json({
        success,
        error: "Please try to login with correct credentials",
        msg: "You are not authorized to access the portal !",
      });
    }

    // ldap authentication - create ldap client
    var client = ldap.createClient({
      // ldap server details
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    var username = empNo + "@powergrid.in";
    // bind ldap
    client.bind(username, password, function (err) {
      if (err) {
        return response.json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
      } else {
        const opts = {
          filter: "sAMAccountName=" + empNo,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };
        // search for user details
        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind();
            return response.json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
          }
          res.on("searchEntry", function (data) {
            var empData = data.object;
            const userData = {
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
            // Create auth-token
            const authToken = jwt.sign(userData, JWT_SECRET);
            success = true;
            client.unbind();
            return response
              .status(200)
              .json({ success, authToken, msg: "Login Successful!" });
          });
          res.on("error", function () {
            client.unbind();
            return response.json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.on("end", () => {
            client.unbind();
            return;
          });
        });
      }
    });
    client.on("error", () => {
      client.unbind();
      return;
    });
  } catch (error) {
    return response.json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// add admin using POST "/api/auth/addAdmin". To be done from backend only
router.post("/addAdmin", async (req, response) => {
  let success = false;
  try {
    const { username, password } = req.body;
    // Check whether admin already exists
    let user = await User.findOne({ empNo: username });
    if (user) {
      return response.status(400).json({
        error: "Employee already exists!",
        success,
        msg: "Employee already exists!",
      });
    }

    // create ldap client
    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    const ldapUsername = username + "@powergrid.in";
    // bind ldap
    client.bind(ldapUsername, password, function (err) {
      if (err) {
        return response.json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
      } else {
        const opts = {
          filter: "sAMAccountName=" + username,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };
        // search for user in ldap
        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind();
            return response.json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
          }
          res.on("searchEntry", async function (data) {
            var empData = data.object;
            let user = await User.create({
              empNo: username,
              name: empData.name,
              location: empData.l,
              department: empData.department,
              post: empData.title,
              isAdmin: true,
            });
            success = true;
            client.unbind();
            return response
              .status(200)
              .json({ success, msg: "Admin Added!", user: user });
          });
          res.on("error", function () {
            client.unbind();
            return response.json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.on("end", () => {
            client.unbind();
            return;
          });
        });
      }
    });
    client.on("error", () => {
      client.unbind();
      return;
    });
  } catch (error) {
    return response.json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// add a user using POST "/api/auth/addUser". Authentication required
router.post("/addUser", fetchuser, async (req, response) => {
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
    // Check whether user already exists
    let user = await User.findOne({ empNo: req.body.empNo });
    if (user) {
      return response.json({
        error: "Employee already exists!",
        success,
        msg: "Employee already exists!",
      });
    }
    // Create ldap client
    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    var username = req.empNo + "@powergrid.in";
    // ldap bind
    client.bind(username, req.password, function (err) {
      if (err) {
        return response.json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
      } else {
        const opts = {
          filter: "sAMAccountName=" + req.body.empNo,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };
        // search user details in ldap
        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind();
            return response.json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
          }
          res.on("searchEntry", async function (data) {
            var empData = data.object;
            user = await User.create({
              empNo: req.body.empNo,
              name: empData.name,
              location: empData.l,
              department: empData.department,
              post: empData.title,
            });
            success = true;
            client.unbind();
            return response
              .status(200)
              .json({ success, msg: "Employee Added!", user });
          });
          res.on("error", function () {
            client.unbind();
            return response.json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.on("end", () => {
            client.unbind();
            return;
          });
        });
      }
    });
    client.on("error", () => {
      client.unbind();
      return;
    });
  } catch (error) {
    return response.json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// remove a user using POST "/api/auth/removeUser". Authentication required
router.post("/removeUser", fetchuser, async (req, response) => {
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
    let user = await User.findById(req.body.id);
    if (!user) {
      return response.json({
        error: "Employee Not Found!",
        success,
        msg: "Employee Not Found!",
      });
    }
    // if admin ? can not remove admin : remove user
    if (user.isAdmin) {
      return response.json({ success, msg: "Cannot remove admin!", user });
    }
    user = await User.findByIdAndDelete(req.body.id);
    success = true;
    return response
      .status(200)
      .json({ success, msg: "Employee has been removed!", user });
  } catch (error) {
    return response.json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// Get user's details from local database using POST "/api/auth/getUser". Login required
router.post("/getUser", fetchuser, async (req, response) => {
  try {
    const user = await User.find(
      { _id: req.id },
      {
        _id: 1,
        empNo: 1,
        name: 1,
        location: 1,
        department: 1,
        post: 1,
        isAdmin: 1,
      }
    );
    return response.status(200).json({ success: true, user });
  } catch (error) {
    return response.send("Internal server error");
  }
});

// Get all users from local database using POST "/api/auth/getAllAddedUsers". Login required
router.post("/getAllAddedUsers", fetchuser, async (req, response) => {
  try {
    // Check for admin login
    if (!req.isAdmin) {
      return response.json({
        error: "Admin Authentication Required!",
        success,
        msg: "Admin Authentication Required!",
      });
    }
    const user = await User.find(
      {},
      { _id: 1, empNo: 1, name: 1, location: 1, department: 1, post: 1 }
    );
    return response.status(200).json({ success: true, user });
  } catch (error) {
    return response.send("Internal server error");
  }
});

// Get all WR-II AD users using POST "/api/auth/getAllADUsers". Login required
router.post("/getAllADUsers", fetchuser, async (req, response) => {
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
    // Create ldap client
    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    var username = req.empNo + "@powergrid.in";
    // ldap bind
    client.bind(username, req.password, function (err) {
      if (err) {
        return response.json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
      } else {
        const opts = {
          filter: "sAMAccountName=*",
          scope: "sub",
          attributes: [
            "l",
            "st",
            "title",
            "name",
            "department",
            "company",
            "sAMAccountName",
          ],
        };
        // search user details in ldap
        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind();
            return response.json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
          }
          var empData = [];
          res.on("searchEntry", function (data) {
            if ("title" in data.object)
              empData.push({
                value: data.object.sAMAccountName,
                label:
                  data.object.name +
                  ", " +
                  data.object.title +
                  ", " +
                  data.object.department +
                  ", " +
                  data.object.l,
              });
          });
          res.on("error", function () {
            client.unbind();
            return response.json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
          res.on("end", function (result) {
            if (result.status !== 0) {
              return response.json({
                success,
                error: "Some error occured!",
                msg: "Some error occured!",
              });
            } else {
              success = true;
              client.unbind();
              return response.status(200).json({
                success,
                empData,
              });
            }
          });
        });
      }
    });
    client.on("error", () => {
      client.unbind();
      return;
    });
  } catch (error) {
    return response.json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

module.exports = router;
