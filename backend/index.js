import connectToMongo from "./db.js";
import express, { json } from "express";

connectToMongo();

const app = express();

const port = 5000;

app.use(json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/contracts", require("./routes/contracts"));

app.listen(port, () => {
  console.log(`React App listening at http://localhost:${port}`);
});