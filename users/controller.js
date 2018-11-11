'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    text: 'Ok. Deu certo 3!'
  });
});

module.exports = router;