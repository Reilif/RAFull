/**
 * Created by Robin on 26.06.2015.
 */

var fs = require('fs');
var request = require('request');
//Methoden zur CA-Verbindung

/**
 * Erzeugt das Client Certificate
 */
exports.createClientCertificate = function (user, cb) {
  var data = {};
  data.C = user.adr.country;
  data.ST = user.adr.state;
  data.L = user.adr.zip;
  data.O = user.adr.street;
  data.OU = user.name;
  data.CN = user.idnr;

  request.post(
    'http://vm02.srvhub.de:8081/ca/generate',
    { json: data },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body.passphrase);

        var buf = new Buffer(body.certdata, 'base64');

        cb(buf, body.passphrase);
      }
    }
  );
}

/**
 * Erzeugt das Certificate
 */
exports.signCertificate = function (csr,cb,err) {
  var buf = new Buffer(csr).toString('base64');
  var data = {csr: buf};
  request.post(
    'http://vm02.srvhub.de:8081/ca/sign',
    { json: data },
    function (error, response, body) {
      if (!error && response.statusCode == 200 && body) {
        console.log("Signieren CA Ok");
        var buf = new Buffer(body.certdata, 'base64');
        cb(buf, body.cn, body.cd);
      }else{
        console.log("Signieren CA Fehler");
        err();
      }
    }
  );
}


/**
 * Revoced Certificate
 */
exports.revokeCertificate = function (cert, cb, err) {
  var data = {name: cert.name};
  request.put(
    'http://vm02.srvhub.de:8081/ca/revoke',
    { json: data },
    function (error, response, body) {
      if (!error && response.statusCode == 200 && body) {
        console.log("Revoke Ok");
        cb(body.status);
      }else{
        console.log("Revoke CA Fehler");
        err();
      }
    }
  );
}
