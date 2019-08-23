const { MongoClient } = require('mongodb');
const createMenu = require('./menuData.js');

MongoClient.connect('mongodb://localhost:27017/menu', (err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connection success!')
    const db = client.db('menu');
    const menus = [];
    for (let i = 0; i < 100; i++) {
      menus.push(createMenu());
    }
    db.collection('menu').insertMany(menus);
  }
});
