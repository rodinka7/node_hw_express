const db = global.DB;

const Joi = require('@hapi/joi');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

const { errors, upload } = require('../../config');

function validate(data){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().integer().min(0).required(),
        type: Joi.string().pattern(new RegExp('image/jpeg|image.jpg|image.png')).required(),
        size: Joi.number().required()
    });

    return schema.validate(data);
}

module.exports = async response => {
    const file = response.data.files.photo;
    const { name, price } = response.data.body;
    const { type, size } = file;

    const filePath = file.path;
    const fileName = file.name;

    const valid = validate({ name, price, type, size });

    if (valid.error){
        await unlink(filePath);
        response.replyErr({message: 'При загрузке данных на сервер произошла ошибка!'});
    } else {
        const reader = fs.createReadStream(filePath);
        const stream = fs.createWriteStream(path.join(upload, fileName));
        reader.pipe(stream);
        console.log('uploading %s -> %s', fileName, stream.path);

        try {
            await rename(filePath, path.join(upload, fileName));
        } catch(err){
            response.replyErr(err)
        }

        db.emit('upload/add', {
            photo: fileName,
            name,
            price
        })
        .then(() => response.reply({}))
        .catch(err => response.replyErr(errors[err]));
    }
}