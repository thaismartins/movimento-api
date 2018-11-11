'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({
    text: 'Ok. Deu certo 2!'
  });
});

module.exports = router;