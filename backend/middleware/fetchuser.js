import jwt from "jsonwebtoken";
const JWT_SECRET = "$contracts@Portal$";

const fetchuser = (req, res, next) => {

  // Get the user from the jwt token and add id to req object
  
  const token = req.header("auth-token");
  console.log(token);
  
  if (!token) {
    return res.status(401).send({ status: false, msg: "Please Authenticate!", error: "Please Authenticate!" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.isAdmin = data.user.isAdmin;
    req.empNo = data.user.empNo;
    req.password = data.user.password;
    next();
  } catch (error) {
    return res.status(401).send({ status: false, msg: "Please Authenticate!", error: "Some Error Occurred!" });
  }
};

export default fetchuser;
