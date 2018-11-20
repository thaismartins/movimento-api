'use strict';

const express = require('express');
const router = express.Router();
require('./config/auth');

router.use('/users', require('./src/users/controller'));

module.exports = router;