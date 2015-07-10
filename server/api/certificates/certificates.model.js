'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CertificatesSchema = new Schema({
  name: String,
  date: Date,
  revokeDate: Date,
  file: { data: Buffer, contentType: String },
  csr: { data: Buffer, contentType: String },
  owner: Schema.ObjectId,
  caClient: {type: Boolean, default: true},
  revoked: {type: Boolean, default: false}
});

module.exports = mongoose.model('Certificates', CertificatesSchema);
