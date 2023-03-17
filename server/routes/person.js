const express = require('express');
const {
  getPerson,
  getToday,
  getTodayByType,
  getPersonGames,
  getPersons,
} = require('../db');
const { fetchPersons, flattenGames } = require('./utils');

const router = express.Router();

router.get('/list', async (req, res) => {
  const persons = await getPersons();
  res.json(persons);
});

const kidsBranchMap = {
  4: { adultBranch: 0 }, // 서초
  5: { adultBranch: 1 }, // 대치
  6: { adultBranch: 2 }, // 천안
  7: { adultBranch: 3 }, // 하남
};

router.get('/today/:branch', async (req, res) => {
  const { branch } = req.params;
  let persons = await getToday(branch);
  if (branch in kidsBranchMap) {
    const { adultBranch } = kidsBranchMap[branch];
    const coaches = await getTodayByType(adultBranch, 0);
    persons = [...persons, ...coaches];
  }
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
  const games = flattenGames(await getPersonGames(pid)).filter(
    ({ ls, rs }) => ls.includes(id) || rs.includes(id)
  );
  const persons = await fetchPersons(games);

  const byDate = [];
  const byPerson = {};
  games.forEach(({ time, branch, type, ls, rounds }) => {
    const date = time.toISOString().substring(0, 10);
    if (byDate.length === 0 || byDate[byDate.length - 1].date !== date) {
      byDate.push({ date, branch, count: 0, wins: 0 });
    }

    const [dateObj] = byDate.slice(-1);
    const { l, r, lp, rp } = rounds[rounds.length - 1];
    const isLeft = ls.includes(id);
    const win = isLeft ? lp > rp : lp < rp;

    dateObj.count += 1;
    if (win) {
      dateObj.wins += 1;
    }

    if ([1, 'T'].includes(type)) {
      const vs = isLeft ? r : l;

      if (byPerson[vs] === undefined) {
        byPerson[vs] = { count: 0, wins: 0, latest: date };
      }

      const target = byPerson[vs];
      target.count += 1;

      if (win) {
        target.wins += 1;
      }

      if (target.latest < date) {
        target.latest = date;
      }
    }
  });

  res.json({ persons, byDate, byPerson });
});

module.exports = router;
