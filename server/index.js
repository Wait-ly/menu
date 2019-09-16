const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../database/database.js');

const { findMenu,
        createMenu,
        readMenu,
        updateMenu,
        deleteMenu
      } = db;
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

app.get('/api/menu/:id', (req, res) => {
  const menuId = req.params.id;
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

// createMenu,
//         getMenu,
//         updateMenu,
//         deleteMenu
app.post('/api/menu/:id', (req, res) => {
  // Create menu
  createMenu(req.params.id, req.body, (result) => {
    res.send(result);
  });
});

app.get('/api/menu/:id', (req, res) => {
  // Read menu for business with ID ':id'
  readMenu(req.params.id, (result) => {
    res.send(result);
  });
});

app.put('/api/menu/:id', (req, res) => {
  // Update menu
  updateMenu(req.params.id, req.body, (result) => {
    res.send(result);
  });
});

app.delete('/api/menu/:id', (req, res) => {
  // delete menu for business with ID ':id'
  deleteMenu(req.params.id, (result) => {
    res.send(result);
  });
});

app.listen(port, () => { console.log(`server ${port} is listening...`); });

module.exports.app = app;
