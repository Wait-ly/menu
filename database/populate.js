/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { createMenu } = require('./menuData.js');

const menuSchema = new mongoose.Schema({ any: {}, id: Number }, { strict: false });

const conn = mongoose.createConnection('mongodb://database/menu',
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  });

const Menu = conn.model('Menu', menuSchema);
const allMenus = [];

conn.collection('menus').drop(
  () => {
    console.log('collection dropped!');
    for (let i = 1; i < 101; i++) {
      const menu = createMenu(i);
      allMenus.push(menu);
    }
    Menu.insertMany(allMenus, (err) => {
      if (err) {
        console.log('this is insertMany error', err);
      } else {
        console.log('finished populating');
        mongoose.disconnect();
      }
    });
  },
);
