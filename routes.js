'use strict';

const express = require('express');
const router = express.Router();

router.use('/users', require('./users/controller'));

module.exports = router;