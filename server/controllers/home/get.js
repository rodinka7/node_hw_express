const db = global.DB;
const { errors } = require('../../config');

module.exports = response => {
    db.emit('get/all')
    .then(data => response.reply(data))
    .catch(err => response.replyErr(errors[err]));
}