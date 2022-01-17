const express = require('express');
const { getPersons } = require('../db');

const router = express.Router();

router.get('/list', async (req, res) => {
  const persons = await getPersons();
  res.json(persons);
});

module.exports = router;
