const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../database/database.js');

const { findMenu } = db;
const app = express();
const port = 3004;

app.use(compression());
app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/:L/menu', express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/:L/menu', (req, res) => {
  const menuId = req.params.L;
  findMenu(menuId)
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

app.get('/api/:L/menu/create', (req, res) => {
  // Create menu for business with ID 'L'
});

app.get('/api/:L/menu/read', (req, res) => {
  // Read menu for business with ID 'L'
});

app.get('/api/:L/menu/update', (req, res) => {
  // Update menu for business with ID 'L'
});

app.get('/api/:L/menu/delete', (req, res) => {
  // delete menu for business with ID 'L'
});


app.listen(port, () => { console.log(`server ${port} is listening...`); });

module.exports.app = app;
