const { db } = require('./populate.js');
const createMenu = require('./menuData.js');
const { Schema } = db;

const menuSchema = new Schema({});
const Menu = db.model('Menu', menuSchema);

const drop =