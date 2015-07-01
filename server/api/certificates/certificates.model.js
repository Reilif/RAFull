'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CertificatesSchema = new Schema({
  name: String,
  date: Date,
  revokeDate: Date,
  file: { data: Buffer, contentType: String },
  owner: Schema.ObjectId
});

module.exports = mongoose.model('Certificates', CertificatesSchema);
