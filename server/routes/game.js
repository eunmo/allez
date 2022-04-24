const express = require('express');
const {
  getGame,
  getGameDates,
  getGamesByDate,
  getPersonGames,
  getHistory,
} = require('../db');

const router = express.Router();

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  const game = await getGame(id);
  res.json(game);
});

router.get('/dates/:branch', async (req, res) => {
  const { branch } = req.params;
  const dates = await getGameDates(branch);
  res.json(dates);
});

router.get('/date/:branch/:date', async (req, res) => {
  const { branch, date } = req.params;
  const games = await getGamesByDate(branch, date);
  res.json(games);
});

router.get('/person/:pid', async (req, res) => {
  const { pid } = req.params;
  const games = await getPersonGames(pid);
  res.json(games);
});

router.get('/history/:pid1/:pid2', async (req, res) => {
  const { pid1, pid2 } = req.params;
  const games = await getHistory(pid1, pid2);
  res.json(games);
});

module.exports = router;
