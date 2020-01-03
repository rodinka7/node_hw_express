const db = global.DB;
module.exports = response => {
    db.emit('get/all')
    .then(data => response.reply(data))
    .catch(error => response.replyErr(error));
}