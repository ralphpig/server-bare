// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var util = require('./util/util');
var auth = require("./util/auth");
var mysql = require("./util/mysql");

var app = express();

// Connect to db
//mysql.connect();

// Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));

// Logging
app.use(function (req, res, next) {   
   console.log(req.ip + " | " + req.method + " " + req.headers.host + req.path + " : " + JSON.stringify(req.body));
   next();
});

// Subdomain Routes
//app.use(util.subdomain("api", require('./routes/api')));\

// Routes
app.use("/api", require("./routes/api"));

// Used for https cert.
app.use("/", express.static("letsencrypt"));

app.use("*", function(req, res) {
   res.sendStatus(404);
});

app.listen(process.env.PORT || 8000, "0.0.0.0", function() {
   console.log("Listening on port " + (process.env.PORT || 8000));
});
