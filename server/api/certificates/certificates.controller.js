'use strict';

var _ = require('lodash');
var Certificates = require('./certificates.model');
var CA = require('../../CA/CA');
var util = require('util');
var fs = require('fs');

// Get list of certificatess
exports.index = function(req, res) {
  Certificates.find({owner:req.params.owner},'-file -csr',function (err, certificatess) {
    if(err) { return handleError(res, err); }
    return res.json(200, certificatess);
  });
};

exports.downloadCAClient = function(req, res) {
  Certificates.where({owner:req.params.owner, caClient: true}).findOne(function (err, cert) {
    if(err) { return handleError(res, err); }
    if(!cert) { return res.send(404); }
    res.setHeader('Content-disposition', 'attachment; filename=ca-client-cert.pfx');
    res.setHeader('Content-type','application/x-pkcs12');
    return res.end(cert.file.data);
  });
};

exports.download = function(req, res) {
  Certificates.findById(req.params.id, function (err, cert) {
    if(err) { return handleError(res, err); }
    if(!cert) { return res.send(404); }

    var text = cert.name + getFileEnding(cert.file.contentType);
    res.setHeader('Content-disposition', 'attachment; filename='+text);
    res.setHeader('Content-type',cert.file.contentType);
    return res.end(cert.file.data);
  });
};

exports.createCACert = function(data, ownerid, cb){
  var cert = {};

  cert.name = "RA Client Certificate";
  cert.date = new Date();
  cert.revokeDate = new Date();
  cert.file = {};
  cert.file.data = data;
  cert.file.contentType = 'application/x-pkcs12';
  cert.owner = ownerid;

  Certificates.create(cert, function(err, certificates) {
    console.log("Zertifikate: "+certificates);
    if(err) { cb(null) }
    return cb(certificates);
  });
};

// Creates a new certificates in the DB.
exports.create = function(req, res) {
  console.log(req.files);
  console.log(req.body);

  var data = fs.readFileSync(req.files.file.path);

  var cert = {};


  cert.date = new Date();

  cert.file = {};
  cert.csr = {};
  cert.csr.data = data;
  cert.csr.contentType = "application/pkcs10";
  cert.owner = req.body.userid;

  CA.signCertificate(data, function(data, cn, cr){
    cert.name = cn;
    cert.revokeDate = new Date(cr);
    cert.file.data = data;
    cert.file.contentType = "application/x-cert";
      console.log("Vor DB");
    Certificates.create(cert, function(err, certificates) {

      if(err) { console.log(err); return handleError(res, err); }
      return res.json(201);
    });
  },
  function(){
    return res.json(500);
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
    console.log("CA Revoke");
    CA.revokeCertificate(certificates, function(status){
      console.log("Status:" +status);
      if(status == 1){

        Certificates.findByIdAndUpdate(req.params.id, {revoked : true},function (err, cert) {
          res.json(200, {revoked: true});
        });
      }
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function getFileEnding(contenttype){
  switch(contenttype){
    case 'application/x-cert': return '.crt';
    case 'application/pkcs10': return '.csr';
    case 'application/x-pkcs12': return '.pfx';
  }
}
