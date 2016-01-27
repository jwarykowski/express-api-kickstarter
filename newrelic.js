'use strict';

const pkg = require('./package');
const key = '################################';

exports.config = {
    app_name: [pkg.name],
    license_key: key,
    logging: {
        level: 'info'
    }
}
