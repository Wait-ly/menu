/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { createMenu } = require('./menuData.js');

const menuSchema = new mongoose.Schema({ any: {}, id: Number }, { strict: false });

const conn = mongoose.createConnection('mongodb://localhost/menu',
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  });

const Menu = conn.model('Menu', menuSchema);
const allMenus = [];
const numMenus = 1000;

var secondsToReadableTime = (timeInSeconds) => {
  var hours = 0;
  var minutes = 0;
  var seconds = timeInSeconds;
  hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  var result = '';
  if (hours > 0) {
    result += `${hours} hours, `;
  }
  if (minutes > 0) {
    result += `${minutes} minutes, `;
  }
  if (seconds > 0) {
    result += `${seconds} seconds`;
  }
  return result;
}

conn.collection('menus').drop(
  () => {
    console.log('collection dropped!');
    console.log('Creating new database...');
    let start = Date.now();
    for (let i = 1; i < numMenus + 1; i++) {
      let menu = createMenu(i);
      allMenus.push(menu);
    }
    const creationTime = Date.now() - start;
    console.log(`Time to create ${numMenus} menus: ${(creationTime / 1000).toFixed(2)} seconds`);
    let projectedTime = ((creationTime / numMenus).toFixed(6) * 10000).toFixed(2);
    console.log(`Projected amount of time to create 10M menus: ${secondsToReadableTime(projectedTime)}`);
    start = Date.now();
    Menu.insertMany(allMenus, (err) => {
      if (err) {
        console.log('this is insertMany error', err);
      } else {
        const elapsed = Date.now() - start;
        projectedTime = (elapsed / numMenus).toFixed(6) * 10000;
        console.log(`finished populating in ${(elapsed / 1000).toFixed(2)} seconds`);
        console.log(`Projected amount of time to save 10M menus to DB: ${secondsToReadableTime(projectedTime)}`);
        mongoose.disconnect();
      }
    });
  },
);
