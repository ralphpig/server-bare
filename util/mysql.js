"use strict";

// Dependencies
let db = require('mysql');
let config = require('./config');

// MySQL Functions
let mysql = {
   "connection": null,
   "connect": function() {
      this.connection = db.createConnection({
         "host"      : config.mysql.host,
         "user"      : config.mysql.username,
         "password"  : config.mysql.password,
         "database"  : config.mysql.database
      });
      this.connection.connect();
      return this;
   },
   "connect_nodb": function() {
      this.connection = db.createConnection({
         "host"      : config.mysql.host,
         "user"      : config.mysql.username,
         "password"  : config.mysql.password
      });
      this.connection.connect();
      return this;
   },
   "query": function(query, cb) {
      console.log(`QUERY: ${ query }`);
      this.connection.query(query, cb);
   },
   "find": function(table, values, filter, cb) {
      let valuesString = "*", filterString = "";
      if (typeof values === "function") {
         cb = values;
         values = [];
         filter = {};
      } else if (typeof filter === "function") {
         cb = filter;
         if (!Array.isArray(values)) {
            filter = values;
            values = [];
         } else filter = {};
      }

      let valueKeys = Object.keys(values);
      if(Object.keys(values).length) valuesString = "";

      for (let i = 0; i < values.length; i++) {
         // Escape apostrophe
         values[i] = escapeApostrophe(values[i]);

         valuesString += values[i] + ((i === valueKeys.length-1) ? '' : ',');
      }

      let filterKeys = Object.keys(filter);
      if(filterKeys.length) filterString = " WHERE ";

      for (let key in filter) {
         let i = filterKeys.indexOf(key);
         // Escape apostrophe
         filter[key] = escapeApostrophe(filter[key]);

         filterString += `${ key }='${ filter[key] }'${ (i === filterKeys.length-1) ? '' : ' AND ' }`;
      }

      this.query(`SELECT ${ valuesString } FROM ${ table } ${ filterString }`, cb);
   },
   "update": function(table, values, filter, cb) {
      let valuesString = "*", filterString = "";
      if (typeof filter === "function") {
         cb = filter;
      }


      let valueKeys = Object.keys(values);
      if(valueKeys.length) valuesString = " SET ";

      for (let key in values) {
         let i = valueKeys.indexOf(key);
         // Escape apostrophe
         values[key] = escapeApostrophe(values[key]);
         values[key] = (values[key]) ? `'${ values[key] }'` : "NULL";

         valuesString += `${ key }=${ values[key] }${ (i === valueKeys.length-1) ? '' : ',' }`;
      }


      let filterKeys = Object.keys(filter);
      if(filterKeys.length) filterString = " WHERE ";

      for (let key in filter) {
         let i = filterKeys.indexOf(key);
         // Escape apostrophe
         filter[key] = escapeApostrophe(filter[key]);

         filterString += `${ key }='${ filter[key] }'${ (i === filterKeys.length-1) ? '' : ' AND ' }`;
      }

      this.query(`UPDATE ${ table } ${ valuesString } ${ filterString }`, cb);
   },
   "remove": function(table, filter, cb) {
      let filterString = "WHERE ";
      if (typeof filter === "function") return;

      let filterKeys = Object.keys(filter);

      for (let key in filter) {
         let i = filterKeys.indexOf(key);
         // Escape apostrophe
         filter[key] = escapeApostrophe(filter[key]);

         filterString += `${ key }='${ filter[key] }'${ (i === filterKeys.length-1) ? '' : ' AND ' }`;
      }

      this.query(`DELETE FROM ${ table } ${ filterString }`, cb);
   },
   "removeById": function(table, id, cb) {
      this.query(`DELETE FROM ${ table } WHERE id='${ id }'`, cb);
   },
   "insert": function(table, data, cb) {
      let labels = Object.keys(data);
      if(!labels.length) return cb("No data");

      let names = "(";
      let values = "VALUES(";
      for(let i = 0; i < labels.length; i++) {
         // Escape apostrophe
         data[labels[i]] = escapeApostrophe(data[labels[i]]);

         names += `${ table }.${ labels[i] }${ (i === labels.length-1) ? ')' : ',' }`;
         values += `'${ data[labels[i]] }'${ (i === labels.length-1) ? ')' : ',' }`;
      }

      this.query(`INSERT INTO ${ table } ${ names } ${ values }`, cb);
   },
   "checkToken": function(token, cb) {
      this.query(`SELECT * FROM (SELECT token FROM client) as tokens WHERE tokens.token='${ token }'`, cb);
   },
   "end": function() {
      this.connection.end();
   }
}

function escapeApostrophe(data) {
   if(typeof data === "string") data = data.replace(/[']/g, "''");
   return data;
}

module.exports = mysql;
