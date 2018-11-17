const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const config = require('./config/settings');

mongoose.connect('mongodb://127.0.0.1:27017/mud', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', error => console.log('MongoDB ERROR: ', error) );
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

// Handle errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error : error });
});

app.listen(config.port, function () {
  console.log(`App listening on http://localhost:${config.port}/`)
});