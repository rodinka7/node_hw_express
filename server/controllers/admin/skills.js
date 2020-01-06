const db = global.DB;
const Joi = require('@hapi/joi');
const errors = require('../vars');

module.exports = async response => {
    const schema = Joi.object().keys({
        id: Joi.number().integer().min(0).required(),
        age: Joi.number().integer().min(0).required(),
        concerts: Joi.number().integer().min(0).required(),
        cities: Joi.number().integer().min(0).required(),
        years: Joi.number().integer().min(0).required(),
    });

    const result = schema.validate(data = { age, concerts, cities, years } = response.data);
    if (result.error) {
        console.log(result.error);
        return response.replyErr({ message: 'В полях должны быть указаны целые числовые значения!', status: 400 });
    }

    db.emit('skills/update', data)
    .then(() => response.reply({}))
    .catch(err => response.replyErr(errors[err]));
}