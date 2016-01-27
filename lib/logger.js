'use strict';

const bunyan  = require('bunyan');
const config  = require('config');
const path    = require('path');
const pkg     = require('../package');

module.exports = bunyan.createLogger({
    name: pkg.name,
    serializers: bunyan.stdSerializers,
    streams: [
        {
            level: config.log.level,
            stream: process.stdout
        },
        {
            count: 7,
            level: 'info',
            path: path.resolve(__dirname, `../logs/${pkg.name}-info.log`),
            src: true,
            type: 'rotating-file'
        },
        {
            count: 7,
            level: 'error',
            path: path.resolve(__dirname, `../logs/${pkg.name}-error.log`),
            src: true,
            type: 'rotating-file'
        }
    ]
});
