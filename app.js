// Importing all the requried modules
const express = require("express");
const mysql = require("mysql");
const path = require("node:path");
const ejs = require("ejs");
const bodyParser = require("body-parser");

// Initializing APP
const app = express();

// setting malwares
app.set("view engine", "ejs");


app.use("/", require("./Router/router.js"));
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.listen(3000, () => {
    console.log("App is listingin at http://localhost:3000");
})