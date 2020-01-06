const ee = require('@nauma/eventemitter');
const CTRL = new ee.EventEmitter('ctrl');

global.CTRL = CTRL;

const homeGet = require('./home/get');
const homePost = require('./home/post');

const loginGet = require('./login/get');
const loginPost = require('./login/post');

const adminGet = require('./admin/get');
const adminSkills = require('./admin/skills');
const adminUpload = require('./admin/upload');

const db = global.DB;

CTRL.on('index/get', homeGet);
CTRL.on('index/post', homePost);

CTRL.on('login/get', loginGet);
CTRL.on('login/post', loginPost);

CTRL.on('admin/get', adminGet);
CTRL.on('admin/skills', adminSkills);
CTRL.on('admin/upload', adminUpload);