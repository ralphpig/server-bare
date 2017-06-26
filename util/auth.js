// Dependencies
var path = require("path");
var util = require("./util");
var db = require("./mysql");
var config = require("./config");

// Authorization
var auth = {
   "admin": function (req, res, next) {
      // CHECK AUTH
      // req.headers.authorization
   }
}

module.exports = auth;
