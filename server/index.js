const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('../database/populate.js');

const { findMenu } = db;
const app = express();
const port = 3000;

app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/L7/menu', (req, res) => {
  findMenu(7)
    .then((result) => res.send(result));
});

app.listen(port, () => {console.log(`server ${port} is listening...`); });

module.exports.app = app;
