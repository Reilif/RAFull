'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var CertificatesSchema = new Schema({
  name: String,
  createDate: Date,
  expireDate: Date,
  owner: ObjectId
});

module.exports = mongoose.model('Certificates', CertificatesSchema);
