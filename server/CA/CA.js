/**
 * Created by Robin on 26.06.2015.
 */

var fs = require('fs');
//Methoden zur CA-Verbindung

/**
 * Erzeugt das Client Certificate
 */
exports.createClientCertificate = function (user) {
  return fs.readFileSync('./server/cert/client1.pfx');

}

/**
 * Erzeugt das Certificate
 */
exports.signCertificate = function (csr) {

}


/**
 * Revoced Certificate
 */
exports.revokeCertificate = function(certificate) {

}
