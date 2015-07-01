'use strict';

var express = require('express');
var controller = require('./certificates.controller');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var router = express.Router();

router.get('/my/:owner', controller.index);
router.get('/:id', controller.show);
router.post('/',multipartMiddleware, controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
