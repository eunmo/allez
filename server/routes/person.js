const express = require('express');
const { getPerson, getToday, getPersonGames, getPersons } = require('../db');

const router = express.Router();

router.get('/list', async (req, res) => {
  const persons = await getPersons();
  res.json(persons);
});

router.get('/today', async (req, res) => {
  const persons = await getToday();
  res.json(persons);
});

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  const person = await getPerson(id);
  res.json(person);
});

router.get('/summary/:pid', async (req, res) => {
  const { pid } = req.params;
  const id = parseInt(pid, 10);
  const games = await getPersonGames(pid);
  const persons = await getPersons();

  const individualGames = games.filter(({ type }) => type === 1);

  const byDate = [];
  const byPerson = {};
  individualGames.forEach(({ time, rounds }) => {
    const date = time.toISOString().substring(0, 10);
    if (byDate.length === 0 || byDate[byDate.length - 1].date !== date) {
      byDate.push({ date, count: 0, wins: 0 });
    }

    const [dateObj] = byDate.slice(-1);
    rounds.forEach(({ l, r, lp, rp }) => {
      const vs = l === id ? r : l;
      const win = l === id ? lp > rp : lp < rp;

      if (byPerson[vs] === undefined) {
        byPerson[vs] = { count: 0, wins: 0 };
      }

      const target = byPerson[vs];
      target.count += 1;
      dateObj.count += 1;
      if (win) {
        target.wins += 1;
        dateObj.wins += 1;
      }
    });
  });

  res.json({ persons, byDate, byPerson });
});

module.exports = router;
