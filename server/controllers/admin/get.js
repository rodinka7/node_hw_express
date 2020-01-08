const db = global.DB;
const { errors } = require('../../config');

module.exports = async response => {
    const isAuthorized = response.data.isAuthorized ? true : false;
    if (!isAuthorized){
        response.reply({isAuthorized});
    } else {
        db.emit('get/skills')
        .then(data => response.reply({isAuthorized, skills: data}))
        .catch(err => response.replyErr(errors[err]));
    }
}