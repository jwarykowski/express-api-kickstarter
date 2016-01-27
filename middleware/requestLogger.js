'use strict';

const logger = require('../lib/logger');
const uuid   = require('uuid');

module.exports = function requestLogger(req, res, next) {
    let id = uuid.v4();

    req.logger = logger.child({uuid: id});
    req.logger.debug({req: req}, 'Incoming request');

    res.set('X-Request-ID', id);

    next();
};
