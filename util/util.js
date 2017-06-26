// Dependencies
var crypto = require('crypto');
var db = require('./mysql');

// Util
var util = {
   "err": function(err, res) {
      console.error(err.stack || err);
      if(res) {
         switch (err.name) {
            case "CastError":
               res.sendStatus(404);
               break;
            default:
               res.sendStatus(500);
         }
      }
   },
   "subdomain": function(subdomain, router) {
      return function(req, res, next) {
         var domains = req.headers.host.split(".");
         if(domains[0] == "www") domains.splice(0, 1);
         if(domains.length >= 2 && domains[0] === subdomain) {
            router(req, res, next);
         } else {
            next();
         }
      }
   },
   "domain": function(domain, router) {
      return function(req, res, next) {
         var domains = req.headers.host.split(".");
         if(domains.length >= 2 && domains[domains.length - 1] == domain) {
            router(req, res, next);
         } else {
            next();
         }
      }
   }
}

module.exports = util;
