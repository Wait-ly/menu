require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../database/database.js');

const { 
  createMenuPG,
  readMenuPG,
  updateMenuPG,
  deleteMenuPG,
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

// postgresql routes

app.post('/api/menu/:id', (req, res) => {
  // Create menu
  // console.log(req.body);
  createMenuPG(req.params.id, req.body, (result) => {
    res.send(result);
  });
});

app.get('/api/menu/:id', (req, res) => {
  // Read menu for business with ID ':id
  // console.log(`Received ${req.method} request from ${req.url}`);
  readMenuPG(req.params.id, (result) => {
    res.send([result]);
  });
});

app.put('/api/menu/:id', (req, res) => {
  // Update menu
  updateMenuPG(req.params.id, req.body, (result) => {
    res.send(result);
  });
});

app.delete('/api/menu/:id', (req, res) => {
  // delete menu for business with ID ':id'
  // console.log(`Received a request to delete menu for business_id: ${req.params.id}`);
  deleteMenuPG(req.params.id, (result) => {
    res.send(result);
  });
});

app.listen(port, () => { console.log(`server ${port} is listening...`); });

module.exports.app = app;
