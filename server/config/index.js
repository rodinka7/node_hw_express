const path = require('path');

module.exports.NOT_FOUND = 'not_found';
module.exports.BAD_GATEWAY = 'bad_gateway';

module.exports.errors = {
    'not_found': {
        status: 400,
        message: 'При получении данных возникли ошибки!'
    },
    'bad_gateway': {
        status: 502,
        message: 'При сохранении данных возникли ошибки!'
    }
};

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