const express = require('express');

const person = require('./person');

const router = express.Router();
router.use('/person', person);

module.exports = router;
