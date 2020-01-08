const db = global.DB;
const Joi = require('@hapi/joi');
const { errors } = require('../../config');

module.exports = async response => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email({
            minDomainSegments: 2,
        }).required(),
        message: Joi.string().max(3000).required()
    });

    const result = schema.validate(data = { name, email, message } = response.data);
    if (result.error) {
        console.log(result.error);
        return response.replyErr({ message: 'Заполните форму для отправки!', status: 400 });
    }

    db.emit('message/add', data)
    .then(data => response.reply(data))
    .catch(err => response.replyErr(errors[err]));
}