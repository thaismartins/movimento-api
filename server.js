'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.on('connected', () => {
  if(config.util.getEnv('NODE_ENV') != 'test') {
    console.log(`Mongoose default connection open to ${config.database}`);
  }
});
mongoose.connection.on('error', error => console.log(`Mongoose error: ${error}`));
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

// Handle errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message || error });
});

const server = app.listen(config.port, function () {
  if(config.util.getEnv('NODE_ENV') != 'test') {
    console.log(`App listening on http://localhost:${config.port}/`)
  }
});

module.exports = server;