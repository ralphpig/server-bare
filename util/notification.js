"use strict";

var request = require("request");
var util = require("./util");
var config = require("./config");

var notification = {
   "push": function(client, title, body, message) {
      if(!message) message = title;
      
      var fcmUrl = "https://fcm.googleapis.com/fcm/send";
      
      request({
         url: fcmUrl,
         method: "POST",
         headers: {
            "Authorization": "key=" + config.notificationAuth.fcm,
            "Content-Type": "application/json"
         },
         json: {
            "to": client.push_token,
            "priority": "High",
            "notification": {
               "title": title,
               "body": body,
               "sound": "default",
               "vibrate": "default"
            },
            "data": {
               "message": message
            }
         }
      }, function(err, res, body) {
         if(err) return util.err(err);
         console.log(`FCM Call: ${JSON.stringify(res)}`);
      });
   }
}

module.exports = notification;
