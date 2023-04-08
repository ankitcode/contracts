/* fetchuser Middleware used in auth.js for checking authentication*/

// Include jsonwebtoken module - for verifying jwt token
const jwt = require("jsonwebtoken");
// JWT_SECRET
const JWT_SECRET = "$contracts@Portal$";
// Include formidable to parse form data
const formidable = require("formidable");

// fetchuser function
const fetchuser = (req, res, next) => {
  try {
    // Get token
    const token = req.headers.authtoken;
    if (!token) {
      // Return if token not found
      return res.status(401).send({
        status: false,
        msg: "Please Authenticate!",
        error: "Please Authenticate!",
      });
    }
    // jwt.verify returns the payload decoded if the signature is valid
    const data = jwt.verify(token, JWT_SECRET);
    // Storing user data in req to be used in next function
    req.id = data.user.id;
    req.isAdmin = data.user.isAdmin;
    req.empNo = data.user.empNo;
    req.password = data.user.password;
    req.location = data.location;

    const form = formidable({ multiples: true });
    // Parse form to store contracts data other than file in req
    /*form.parse(req, function(err, fields, files) {
      if (err) {
        console.log("some error");
      }
      console.log(fields);
      req.data = JSON.parse(fields.data);
    });*/

    form
      .parse(req)
      .on("field", function(name, field) {
        if (name == "data" && field) req.data = JSON.parse(field);
      })
      .on("end", function() {
      });

    // Continue to next function
    next();
  } catch (error) {
    // Return on error
    return res.status(401).send({
      status: false,
      msg: "Please Authenticate!",
      error: "Please Authenticate!",
    });
  }
};

module.exports = fetchuser;
