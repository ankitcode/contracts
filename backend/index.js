const connectToMongo = require("./db.js");
const express = require("express");
var bodyParser = require('body-parser')

connectToMongo();
const app = express();

const port = 5000;
var cors = require('cors');

app.use(cors()) 

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/contracts", require("./routes/contracts"));

app.listen(port, () => {
  console.log(`React App listening at http://localhost:${port}`);
});