/* eslint-disable no-console */
const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://localhost:27017/menu',
(err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connection success!');
  }
});

const menuSchema = new mongoose.Schema({ any: {}, id: Number }, { strict: false });
const Menu = conn.model('Menu', menuSchema);

const findMenu = (id) => {
  return Menu.find({ id });
};

module.exports = { findMenu };
