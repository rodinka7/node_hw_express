const path = require('path');

module.exports.session = {
    key: 'koa:sess',
    maxAge: 'session',
    overwrite: true,
    httpOnly: true,
    signed: false,
    rolling: false,
    renew: false
};

module.exports.upload = path.join(__dirname, '../../client/source/images/products');