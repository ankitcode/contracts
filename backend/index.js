/* 
NodeJS is the package, which provides the Javascript runtime environment, 
Express is a framework that sits on top of NodeJS and helps us to handle requests and respnses 

NodeJS provides the require function, whose job is to load modules
and give access to their exports
*/

// Include database configuration file
const connectToMongo = require("./db.js");
// Call connectToMongo function to connect with MongoDB database
connectToMongo();

// Include express
const express = require("express");
// Invoke express function
const app = express();

var cors = require("cors");

// Port for 
const port = 5000;

/*
 use() is a method to configure the middleware used by the routes of the Express HTTP server object
*/

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contracts", require("./routes/contracts"));

app.listen(port, () => {
  console.log(`React App listening at http://localhost:${port}`);
});