'use strict';

const config = require('config');
const logger = require('../lib/logger');

module.exports = (err, req, res, next) => {
    if (!err) {
        return next();
    }

    logger.error(err);

    const env = config.util.getEnv('NODE_ENV');

    if (env !== 'development' && env !== 'test') {
        delete err.stack;
    }

    res.status(err.statusCode || 500).json(err);
};
