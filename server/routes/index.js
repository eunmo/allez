const express = require('express');

const game = require('./game');
const person = require('./person');

const router = express.Router();
router.use('/game', game);
router.use('/person', person);

module.exports = router;
