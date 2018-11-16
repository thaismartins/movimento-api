const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('./config/settings');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

//Handle errors
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({ error : err });
// });

app.listen(config.port, function () {
  console.log(`App listening on http://localhost:${config.port}/`)
});