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

const createMenu = (menu, callback) => {
  Menu.save(menu, (err) => {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
}

const readMenu = (id, callback) => {
  Menu.find({ id }, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(result);
    }
  });
}

const updateMenu = (menu, callback) => {
  Menu.deleteOne({ id: menu.id }, (err) => {
    if (err) {
      callback(err);
    } else {
      Menu.save(menu, (err) => {
        if (err) {
          callback(err);
        } else {
          callback('success');
        }
      });
    }
  });
}

const deleteMenu = (id, callback) => {
  Menu.deleteOne({ id }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
}

module.exports = { findMenu,
                    createMenu,
                    readMenu,
                    updateMenu,
                    deleteMenu
                 };
