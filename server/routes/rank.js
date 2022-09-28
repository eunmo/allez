const express = require('express');
const { getPersons, getGames } = require('../db');

const router = express.Router();

function calculateRanks(games) {
  const personMap = new Map();
  games
    // TODO handle tournaments
    .filter(({ type }) => type !== 'T')
    .forEach(({ time, ls, rs, rounds }) => {
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

      const lastIndex = rounds.length - 1;
      const { lp: lastLp, rp: lastRp } = rounds[lastIndex] ?? { lp: 0, rp: 0 };
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

  return ranks;
}

router.get('/:branch', async (req, res) => {
  const { branch } = req.params;
  const persons = await getPersons();
  const allGames = await getGames(branch);

  const months = new Set();
  const monthlyGames = new Map();
  allGames.forEach((game) => {
    const { time } = game;
    const month = time.toISOString().substring(0, 7);
    months.add(month);
    if (!monthlyGames.has(month)) {
      monthlyGames.set(month, []);
    }
    monthlyGames.get(month).push(game);
  });
  const monthlyRanks = [...monthlyGames.entries()]
    .map(([month, games]) => ({
      month,
      ranks: calculateRanks(games),
    }))
    .sort((a, b) => (a.month > b.month ? -1 : 1));
  const ranks = calculateRanks(allGames);

  res.json({ ranks, monthlyRanks, persons });
});

module.exports = router;
