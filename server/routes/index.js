const express = require('express');

const crud = require('./crud');
const game = require('./game');
const person = require('./person');
const rank = require('./rank');

const router = express.Router();
router.use('/crud', crud);
router.use('/game', game);
router.use('/person', person);
router.use('/rank', rank);

module.exports = router;
