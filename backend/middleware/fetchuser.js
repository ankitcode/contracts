const jwt = require("jsonwebtoken");
const JWT_SECRET = "$contracts@Portal$";

const fetchuser = (req, res, next) => {

  // Get the user from the jwt token and add id to req object
  const token = req.headers.authtoken;
  //console.log(req.headers,"------", req.body);
  if (!token) {
    return res.status(401).send({ status: false, msg: "Please Authenticate!", error: "Please Authenticate!" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.id = data.user.id;
    req.isAdmin = data.user.isAdmin;
    req.empNo = data.user.empNo;
    req.password = data.user.password;
    req.location = data.user.location
    next();
  } catch (error) {
    return res.status(401).send({ status: false, msg: "Please Authenticate!", error: "Please Authenticate!" });
  }
};

module.exports = fetchuser;
