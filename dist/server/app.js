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
  key: fs.readFileSync('server/cert/server2.key'),
  cert: fs.readFileSync('server/cert/server1.crt'),
  ca: fs.readFileSync('server/cert/ca1.crt'),
  requestCert:        true,
  rejectUnauthorized: false
}

// Setup server
var app = express();
var server = https.createServer(options,app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
