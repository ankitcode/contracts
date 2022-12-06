const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

var ldap = require("ldapjs");
var assert = require("assert");

const User = require("../models/UserData");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "$contracts@Portal$";

// login a user using POST "/api/auth/login"
router.post("/login", async (req, response) => {
  let success = false;
  let msg = "";
  //console.log(req.body);
  const { empNo, password } = req.body;
  try {
    // Check user in local database before ldap authentication
    let user = await User.findOne({ empNo });
    if (!user) {
      return response.status(400).json({
        success,
        error: "Please try to login with correct credentials",
        msg: "You are not authorized to access the portal !",
      });
    }

    // ldap authentication
    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    var username = empNo + "@powergrid.in";
    client.bind(username, password, function (err) {
      //console.log("bind");
      if (err) {
        return response.status(400).json({
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
            return response.status(400).json({
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
            //console.log(empData);

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
            const authToken = jwt.sign(userData, JWT_SECRET);
            //console.log(userData);
            success = true;
            return response
              .status(200)
              .json({ success, authToken, msg: "Login Successful!" });
          });
          res.once("error", function (error) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
        });
      }
    });
    client.on("error", (err) => {
      console.log(err.message); // this will be your ECONNRESET message
    });
  } catch (error) {
    //console.error(error.message);
    return response.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// add admin using POST "/api/auth/addAdmin". To be done one time only from backend
router.post("/addAdmin", async (req, response) => {
  //console.log(req.body);
  let success = false;
  let msg = "";
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

    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    const ldapUsername = username + "@powergrid.in";
    client.bind(ldapUsername, password, function (err) {
      if (err) {
        return response.status(400).json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
        //console.log("Incorrect Credentials!");
      } else {
        const opts = {
          filter: "sAMAccountName=" + username,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };

        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.status(400).json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
            //console.log("Incorrect Credentials!");
          }
          res.on("searchEntry", async function (data) {
            //console.log("Data found", data.object);
            var empData = data.object;
            //var empDataJSON = JSON.parse(empData);
            //console.log(empDataJSON.name, empDataJSON.title, empDataJSON.l);
            //console.log(empData);
            let user = await User.create({
              empNo: username,
              name: empData.name,
              location: empData.l,
              department: empData.department,
              post: empData.title,
              isAdmin: true,
            });
            success = true;
            return response
              .status(200)
              .json({ success, msg: "Admin Added!", user: user });
          });
          res.once("error", function (error) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
        });
      }
    });
    client.on("error", (err) => {
      console.log(err.message); // this will be your ECONNRESET message
    });
  } catch (error) {
    return response.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// add a user using POST "/api/auth/addUser". Authentication required
router.post("/addUser", fetchuser, async (req, response) => {
  //console.log(req.body);
  let success = false;
  let msg = "";
  try {
    // Check for admin login
    if (!req.isAdmin) {
      return response.json({
        error: "Admin Authentication Required!",
        success,
        msg: "Admin Authentication Required!",
      });
    }

    // Check whether employee already exists
    console.log(req.body.empNo);
    console.log(req.empNo);
    console.log(req.password);
    let user = await User.findOne({ empNo: req.body.empNo });
    console.log(user);
    if (user) {
      return response.json({
        error: "Employee already exists!",
        success,
        msg: "Employee already exists!",
      });
    }

    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    var username = req.empNo + "@powergrid.in";
    client.bind(username, req.password, function (err) {
      if (err) {
        return response.json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
        //console.log("Incorrect Credentials!");
      } else {
        const opts = {
          filter: "sAMAccountName=" + req.body.empNo,
          scope: "sub",
          attributes: ["l", "st", "title", "name", "department", "company"],
        };

        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.json({
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
            user = await User.create({
              empNo: req.body.empNo,
              name: empData.name,
              location: empData.l,
              department: empData.department,
              post: empData.title,
            });
            //const authToken = jwt.sign(data, JWT_SECRET);
            //console.log(authToken);
            success = true;
            return response
              .status(200)
              .json({ success, msg: "Employee Added!", user });
          });
          res.once("error", function (error) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });
        });
      }
    });
    client.on("error", (err) => {
      console.log(err.message); // this will be your ECONNRESET message
    });
  } catch (error) {
    return response.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// remove a user using POST "/api/auth/removeUser". Authentication required
router.post("/removeUser", fetchuser, async (req, response) => {
  //console.log(req.body);
  let success = false;
  let msg = "";
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
    user = await User.findByIdAndDelete(req.body.id);
    success = true;
    return response
      .status(200)
      .json({ success, msg: "Employee has been removed!", user });
  } catch (error) {
    return response.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

// Get users details from local database using POST "/api/auth/getUser". Login required
router.post("/getUser", fetchuser, async (req, response) => {
  try {
    // Check for admin login
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
    //console.log(user);
    return response.status(200).json({ success: true, user });
  } catch (error) {
    //console.error(error.message);
    response.status(500).send("Internal server error");
  }
});

// Get all users from local database using POST "/api/auth/getAllAddedUsers". Login required
router.post("/getAllAddedUsers", fetchuser, async (req, response) => {
  //console.log(req);
  try {
    // Check for admin login
    if (!req.isAdmin) {
      return response.status(400).json({
        error: "Admin Authentication Required!",
        success,
        msg: "Admin Authentication Required!",
      });
    }
    const user = await User.find(
      { _id: { $nin: [req.id] } },
      { _id: 1, empNo: 1, name: 1, location: 1, department: 1, post: 1 }
    );
    //console.log(user);
    return response.status(200).json({ success: true, user });
  } catch (error) {
    //console.error(error.message);
    response.status(500).send("Internal server error");
  }
});

// Get all WR-II AD users using POST "/api/auth/getAllADUsers". Login required
router.post("/getAllADUsers", fetchuser, async (req, response) => {
  let success = false;
  let msg = "";
  try {
    // Check for admin login
    if (!req.isAdmin) {
      return response.status(400).json({
        error: "Admin Authentication Required!",
        success,
        msg: "Admin Authentication Required!",
      });
    }

    var client = ldap.createClient({
      url: "ldap://brahma.powergrid.in:389",
      reconnect: true,
    });
    var username = req.empNo + "@powergrid.in";
    client.bind(username, req.password, function (err) {
      if (err) {
        return response.status(400).json({
          success,
          error: "Incorrect Credentials!",
          msg: "Incorrect Credentials!",
        });
        //console.log("Incorrect Credentials!");
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

        client.search("OU=WR2,DC=powergrid,DC=in", opts, (err, res) => {
          if (err) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.status(400).json({
              success,
              error: "User not found!",
              msg: "User not found!",
            });
            //console.log("Incorrect Credentials!");
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
          res.once("error", function (error) {
            client.unbind((err) => {
              assert.ifError(err);
            });
            return response.status(400).json({
              success,
              error: "Some error occured!",
              msg: "Some error occured!",
            });
          });

          res.on("end", function (result) {
            //console.log('status: ' + result.status);
            if (result.status !== 0) {
              return response.status(400).json({
                success,
                error: "Some error occured!",
                msg: "Some error occured!",
              });
            } else {
              //console.log(empData.length);
              success = true;
              return response.status(200).json({
                success,
                empData,
              });
            }
          });
        });
      }
    });
    client.on("error", (err) => {
      console.log(err.message); // this will be your ECONNRESET message
    });
  } catch (error) {
    return response.status(500).json({
      success,
      error: "Internal server error!",
      msg: "Internal server error!",
    });
  }
});

module.exports = router;
