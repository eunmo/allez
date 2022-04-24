const express = require('express');
const {
  getGame,
  getGameDates,
  getGamesByDate,
  getPersonGames,
  getHistory,
} = require('../db');
const { fetchPersons } = require('./utils');

const router = express.Router();

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  const game = await getGame(id);
  let persons = [];
  if (game !== null) {
    persons = await fetchPersons([game]);
  }
  res.json({ game, persons });
});

router.get('/dates/:branch', async (req, res) => {
  const { branch } = req.params;
  const dates = await getGameDates(branch);
  res.json(dates);
});

router.get('/date/:branch/:date', async (req, res) => {
  const { branch, date } = req.params;
  const games = await getGamesByDate(branch, date);
  const persons = await fetchPersons(games);
  res.json({ games, persons });
});

router.get('/person/:pid', async (req, res) => {
  const { pid } = req.params;
  const games = await getPersonGames(pid);
  const persons = await fetchPersons(games);
  res.json({ games, persons });
});

router.get('/history/:pid1/:pid2', async (req, res) => {
  const { pid1, pid2 } = req.params;
  const games = await getHistory(pid1, pid2);
  const persons = await fetchPersons(games, [pid1, pid2]);
  res.json({ games, persons });
});

module.exports = router;
