const express = require('express');
const app = express();

const config = require('./config');

app.use('/', require('./routes'));

app.listen(config.port, function () {
  console.log(`App listening on http://localhost:${config.port}/`)
});