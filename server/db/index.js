const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
global.DB = DATABASE;

const mongoose = require('mongoose');

const Skill = require('./models/skill');
const Upload = require('./models/upload');
const Message = require('./models/message');

const { NOT_FOUND, BAD_GATEWAY } = require('../config');

mongoose.Promise = global.Promise;

mongoose
  .set('useNewUrlParser', true)
  .set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/koadb');

DATABASE.on('get/all', async response => {
  Upload.find((err, products) => {
    if (err){
      console.log('get/all', err);
      response.replyErr(NOT_FOUND);
    }

    Skill.findOne((err, skills) => {
      if (err){
        console.log('get/all', err);
        response.replyErr(NOT_FOUND);
      }

      response.reply({
        skills: skills || {},
        products: products || []
      });
    })
  })
});

DATABASE.on('get/skills', async response => {
  Skill.findOne((err, skills) => {
    if (err){
      console.log('get/skills', err);
      response.replyErr(NOT_FOUND);
    }

    response.reply(skills || {});
  })
});

DATABASE.on('skills/update', async response => {
  const id = response.data._id;

  if (id){
    Skill.updateOne(
        {'_id': id},
        {age, concerts, cities, years} = response.data,
        (err, skills) => {
          if (err){
            console.log('skills/update', err);
            response.replyErr(BAD_GATEWAY);
          }
          response.reply({});
        }
    );
  } else {
      delete response.data._id;
      try {
        await Skill.create({age, concerts, cities, years} = response.data);
        response.reply({});
      } catch (error){
        console.log(error);
        response.replyErr(BAD_GATEWAY);
      }
  }
});

DATABASE.on('upload/add', async response => {
  try {
    await Upload.create(response.data);
    response.reply({});
  } catch(error){
    console.log(error);
    response.replyErr(BAD_GATEWAY);
  }
});

DATABASE.on('message/add', async response => {
  try {
    await Message.create(response.data);
    response.reply({});
  } catch(error){
    response.replyErr(BAD_GATEWAY);
  }
});