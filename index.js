'use strict';

require('newrelic');

const bodyParser = require('body-parser');
const config     = require('config');
const compress   = require('compression');
const express    = require('express');
const logger     = require('./lib/logger');
const pkg        = require('./package');
const requestLogger = require('./middleware/requestLogger');
const routes     = require('./routes');

const app = express();

app.use(requestLogger);
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes.ping());
app.use(routes.errorHandler);

app.listen(config.port, config.host, () => {
    logger.info(`${pkg.name} Service: ${config.host}:${config.port}`);
    logger.info(`Running in ${config.util.getEnv('NODE_ENV')} mode`);
});
