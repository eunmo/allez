const express = require('express');
const { getPersons, getGames } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const persons = await getPersons();
  const games = await getGames();

  const personMap = new Map();
  games.forEach(({ time, ls, rs, rounds }) => {
    const date = time.toISOString().substring(0, 10);
    [...ls, ...rs].forEach((pid) => {
      if (!personMap.has(pid)) {
        personMap.set(pid, {
          lastDate: date,
          date: 1,
          wins: 0,
          points: 0,
          diff: 0,
        });
      }

      const person = personMap.get(pid);
      if (person.lastDate !== date) {
        person.lastDate = date;
        person.date += 1;
      }
    });

    const { lp: lastLp, rp: lastRp } = rounds[rounds.length - 1];
    if (lastLp > lastRp) {
      ls.forEach((pid) => {
        personMap.get(pid).wins += 1;
      });
    }
    if (lastLp < lastRp) {
      rs.forEach((pid) => {
        personMap.get(pid).wins += 1;
      });
    }

    let [prevLp, prevRp] = [0, 0];
    rounds.forEach(({ l, r, lp: curLp, rp: curRp }) => {
      const [lp, rp] = [curLp - prevLp, curRp - prevRp];
      [prevLp, prevRp] = [curLp, curRp];
      const left = personMap.get(l);
      left.points += lp;
      left.diff += lp - rp;
      const right = personMap.get(r);
      right.points += rp;
      right.diff += rp - lp;
    });
  });

  const ranks = [...personMap.entries()].map(
    ([id, { date, wins, points, diff }]) => ({ id, date, wins, points, diff })
  );
  res.json({ ranks, persons });
});

module.exports = router;
