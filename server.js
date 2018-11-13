const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

app.listen(config.port, function () {
  console.log(`App listening on http://localhost:${config.port}/`)
});