const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('../database/populate.js');

const { findMenu } = db;
const app = express();
const port = 3004;

app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.get('/api/L7/menu', (req, res) => {
  findMenu(7)
    .then((result) => {
      const memo = [{}];
      const entries = Object.entries(result[0]);
      const menuData = Object.entries(entries[3][1]);
      menuData.forEach((entry) => {
        if (entry[0] !== 'id' && entry[0] !== '_id' && entry[0] !== '__v') {
          // eslint-disable-next-line prefer-destructuring
          memo[0][entry[0]] = entry[1];
        }
      });
      res.send(memo);
    });
});

app.listen(port, () => { console.log(`server ${port} is listening...`); });

module.exports.app = app;
