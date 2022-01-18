const express = require('express');
const { getPerson, getPersons } = require('../db');

const router = express.Router();

router.get('/list', async (req, res) => {
  const persons = await getPersons();
  res.json(persons);
});

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  const person = await getPerson(id);
  res.json(person);
});

module.exports = router;
