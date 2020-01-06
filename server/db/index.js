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

const NOT_FOUND = 'not_found';
const BAD_GATEWAY = 'bad_gateway';

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
    response.replyErr(NOT_FOUND);
  }
});

DATABASE.on('get/skills', async response => {
  try {
    const skills = await models.skill.findOne();
    response.reply(skills);
  } catch(error){
    response.replyErr(NOT_FOUND);
  }
});

DATABASE.on('skills/update', async response => {
  const id = response.data.id;
  try {
    await models.skill.update({age, concerts, cities, years} = response.data, {where: {id}});
    response.reply({});
  } catch(error){
    response.replyErr(BAD_GATEWAY);
  }
});

DATABASE.on('upload/add', async response => {
  try {
    await models.upload.create(response.data);
    response.reply({});
  } catch(error){
    response.replyErr(BAD_GATEWAY);
  }
});

DATABASE.on('message/add', async response => {
  try {
    await models.message.create(response.data);
    response.reply({});
  } catch(error){
    response.replyErr(BAD_GATEWAY);
  }
});

sequelize.models = models;
module.exports = sequelize;