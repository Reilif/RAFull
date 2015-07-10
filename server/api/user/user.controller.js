'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var CA = require('../../CA/CA');
var Certs = require('../certificates/certificates.controller');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};
/**
 * Deletes a user
 * restriction: 'admin'

 */

/**
 * Activates a user
 * restriction: 'admin'
 */
exports.activate = function(req, res) {
  var data = req.body;
  var adr = {};
  adr.zip = data.zip;
  adr.street= data.street;
  adr.state= data.state;
  adr.country = data.country;


  User.findByIdAndUpdate(req.params.id,{activated:true, adr:adr, idnr: data.idnr}, function(err, user) {
    if(err) return res.send(500, err);

    CA.createClientCertificate(user, function(data){
      Certs.createCACert(data, user._id, function(cert){
        User.findByIdAndUpdate(req.params.id,{racreated:true}, function(err, user) {
          return res.send(user);});
      });
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -cert', function(err, user) { // don't ever give out the password or salt


    if (err) return next(err);
    if (!user) return res.json(401);
    console.log(req.client.authorized);
    if(req.client.authorized){
      user.certed = true;
    }else{
      user.certed = false;
    }
    console.log(user);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
