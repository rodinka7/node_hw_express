const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
global.DB = DATABASE;

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, 'config.js'))[env];

const sequelize = new Sequelize(`postgres://${config.username}:${config.password}@${config.host}/${config.database}`, config);

let models = {};
const modelsFolderPath = './models';

fs
  .readdirSync(path.join(__dirname, modelsFolderPath))
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, modelsFolderPath, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

DATABASE.on('get/all', async response => {
  try {
    const skills = await models.skill.findOne();
    const products = await models.upload.findAll();
    response.reply({
      skills,
      products
    });
  } catch(error){
    response.replyErr(error);
  }
});

DATABASE.on('get/skills', async response => {
  try {
    const skills = await models.skill.findOne();
    response.reply(skills);
  } catch(error){
    response.replyErr(error);
  }
});

DATABASE.on('skills/update', async response => {
  const id = response.data.id;
  try {
    await models.skill.update({age, concerts, cities, years} = response.data, {where: {id}});
    response.reply({});
  } catch(error){
    response.replyErr({ message: 'При сохранении данных возникла ошибка!', status: 400 });
  }
});

DATABASE.on('upload/add', async response => {
  try {
    await models.upload.create(response.data);
    response.reply({});
  } catch(error){
    response.replyErr({ message: 'При сохранении данных возникла ошибка!', status: 400 });
  }
});

DATABASE.on('message/add', async response => {
  try {
    await models.message.create(response.data);
    response.reply({});
  } catch(error){
    response.replyErr({ message: 'При сохранении данных возникла ошибка!', status: 400 });
  }
});

sequelize.models = models;
module.exports = sequelize;