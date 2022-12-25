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

// Include express - returns a function reference
const express = require("express");

// Invoke express function - object return by express()
const app = express();

// Cross-Origin Resource Sharing (CORS) - Protocol for making cross-domain requests possible. 
// It allows you to whitelist requests to your web server from certain locations
var cors = require("cors");

// Port for running node server
const port = 5000;

/*
 use() is a method to configure the middleware used by the routes of the Express HTTP server object
*/

app.use(cors());

// express.json() function is a built-in middleware function in Express. 
// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/contracts", require("./routes/contracts"));

// app.listen() creates an http server object and then configures it to receive incoming TCP connections on a specific port and IP address 
// so that when clients request a connection to that port and send an http request, 
// the server can receive that http request and process it, sending a response. 
app.listen(port, () => {
  console.log(`React App listening at http://localhost:${port}`);
});