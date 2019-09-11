/* eslint-disable no-console */
const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://database/menu',
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  });

const menuSchema = new mongoose.Schema({ any: {}, id: Number }, { strict: false });
const Menu = conn.model('Menu', menuSchema);

const findMenu = (id) => Menu.find({ id });

const createMenu = (menu) => Menu.save(menu);

const getMenu = (id) => Menu.find({ id });

const updateMenu = (menu) => Menu.save(menu);

const deleteMenu = (menu) => Menu.save(menu);

module.exports = { findMenu,
                    createMenu,
                    getMenu,
                    updateMenu,
                    deleteMenu
                 };
