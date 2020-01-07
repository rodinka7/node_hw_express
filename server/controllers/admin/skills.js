const db = global.DB;
const Joi = require('@hapi/joi');
const errors = require('../errors');

module.exports = async response => {
    const schema = Joi.object().keys({
        age: Joi.number().integer().min(0).required(),
        concerts: Joi.number().integer().min(0).required(),
        cities: Joi.number().integer().min(0).required(),
        years: Joi.number().integer().min(0).required(),
    });

    const data = response.data;
    const validData = {
        age: data.age,
        concerts: data.concerts,
        cities: data.cities,
        years: data.years
    };

    const result = schema.validate(validData);
    if (result.error) {
        console.log(result.error);
        return response.replyErr({ message: 'В полях должны быть указаны целые числовые значения!', status: 400 });
    }

    db.emit('skills/update', data)
    .then(() => response.reply({}))
    .catch(err => response.replyErr(errors[err]));
}