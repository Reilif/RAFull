'use strict';

var _ = require('lodash');
var Certificates = require('./certificates.model');

// Get list of certificatess
exports.index = function(req, res) {
  Certificates.find(function (err, certificatess) {
    if(err) { return handleError(res, err); }
    return res.json(200, certificatess);
  });
};

// Get a single certificates
exports.show = function(req, res) {
  Certificates.findById(req.params.id, function (err, certificates) {
    if(err) { return handleError(res, err); }
    if(!certificates) { return res.send(404); }
    return res.json(certificates);
  });
};

// Creates a new certificates in the DB.
exports.create = function(req, res) {
  Certificates.create(req.body, function(err, certificates) {
    if(err) { return handleError(res, err); }
    return res.json(201, certificates);
  });
};

// Updates an existing certificates in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Certificates.findById(req.params.id, function (err, certificates) {
    if (err) { return handleError(res, err); }
    if(!certificates) { return res.send(404); }
    var updated = _.merge(certificates, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, certificates);
    });
  });
};

// Deletes a certificates from the DB.
exports.destroy = function(req, res) {
  Certificates.findById(req.params.id, function (err, certificates) {
    if(err) { return handleError(res, err); }
    if(!certificates) { return res.send(404); }
    certificates.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}