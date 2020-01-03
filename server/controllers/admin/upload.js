const db = global.DB;

const Joi = require('@hapi/joi');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

const upload = require('../../db').models.upload;

function validate(fields, files){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().integer().min(0).required(),
        type: Joi.string().pattern(new RegExp('image/jpeg|image.jpg|image.png')).required(),
        size: Joi.number().required()
    });

    const data = {
        ...fields,
        type: files.photo.type,
        size: files.photo.size
    };

    return schema.validate(data);
}

module.exports = async response => {
    const form = new formidable.IncomingForm();
    const upload = path.join(__dirname, '../../../source/images/products');
    try {
        await access(upload);
    } catch(err){
        await mkdir(upload);
    }

    form.uploadDir = upload;
    form.parse(response.data, async (err, fields, files) => {
        if (err){
            response.replyErr(err);
        }

        const valid = validate(fields, files);

        if (valid.error){
            unlink(files.photo.path);
            response.replyErr({message: 'При загрузке данных на сервер произошла ошибка!'});
        } else {
            const photo = files.photo.name;
            try {
                await rename(files.photo.path, path.join(upload,photo));
            } catch(err){
                response.replyErr(err)
            }

            db.emit('upload/add', {
                photo,
                ...fields
            })
            .then(() => response.reply({}))
            .catch(error => response.replyErr(error));
        }
    })
}