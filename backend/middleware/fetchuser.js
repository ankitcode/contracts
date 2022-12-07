const jwt = require("jsonwebtoken");
const JWT_SECRET = "$contracts@Portal$";
const formidable = require('formidable');

const fetchuser = (req, res, next) => {

  //console.log(req.body);
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    const obj = JSON.parse(fields.data);
    //console.log(obj);
    req.data = obj;
  });
  //console.log(req);
  // Get the user from the jwt token and add id to req object
  const token = req.headers.authtoken;
  //console.log(req.headers);
  //console.log(req.headers,"------", req.body);
  //console.log(req.headers.authtoken);
  if (!token) {
    return res.status(401).send({ status: false, msg: "Please Authenticate!", error: "Please Authenticate!" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.id = data.user.id;
    req.isAdmin = data.user.isAdmin;
    req.empNo = data.user.empNo;
    req.password = data.user.password;
    req.location = data.location;
    next();
  } catch (error) {
    return res.status(401).send({ status: false, msg: "Please Authenticate!", error: "Please Authenticate!" });
  }
};

module.exports = fetchuser;
