const express = require('express');

const crud = require('./crud');
const game = require('./game');
const person = require('./person');

const router = express.Router();
router.use('/crud', crud);
router.use('/game', game);
router.use('/person', person);

module.exports = router;
