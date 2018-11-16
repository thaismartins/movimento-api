'use strict';

const express = require('express');
const router = express.Router();

require('./config/auth');

router.use('/users', require('./users/controller'));

module.exports = router;