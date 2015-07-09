/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

var https = require('https');
var fs = require('fs');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

var options = {
  key: fs.readFileSync('server/cert/ra.key.pem'),
  cert: fs.readFileSync('server/cert/ra.cert.pem'),
  ca: [fs.readFileSync('server/cert/intermediate.cert.pem'), fs.readFileSync('server/cert/ca-chain.cert.pem'),fs.readFileSync('server/cert/ca.cert.pem')],
  requestCert:        true,
  rejectUnauthorized: false,
  agent: false
}

// Setup server
var app = express();
var server = https.createServer(options,app);
require('./config/express')(app);
require('./routes')(app);


console.log(config.ip);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
