const Joi = require('@hapi/joi');

module.exports = response => {
    const schema = Joi.object().keys({
        email: Joi.string().email({
            minDomainSegments: 2,
        }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required()
    });

    const result = schema.validate({ email, password } = response.data);
    if (result.error) {
        console.log(result.error);
        return response.replyErr({ message: 'Укажите электронную почту и пароль!', status: 400 });
    }

    response.reply({
        isAuthorized: true
    });
}