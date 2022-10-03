const { getPersonsById } = require('../db');

async function fetchPersons(games, defaultIds = []) {
  const personIds = games.flatMap(({ ls, rs }) => [...ls, ...rs]);
  const idSet = new Set([...personIds, ...defaultIds]);
  const ids = [...idSet];
  if (ids.length === 0) {
    return [];
  }
  return getPersonsById(ids);
}

function flattenGames(games) {
  return games.flatMap((game) => {
    const { type } = game;
    if (type !== 'T') {
      return [game];
    }

    const { time, branch, pools, elimination } = game;

    const mapper = (array) =>
      array
        .filter(
          ({ l, r, lp, rp }) =>
            l !== undefined &&
            r !== undefined &&
            lp !== undefined &&
            rp !== undefined
        )
        .map(({ l, r, lp, rp }) => ({
          time,
          branch,
          type,
          ls: [l],
          rs: [r],
          rounds: [{ l, r, lp, rp }],
        }));

    const poolGames = pools.flatMap(({ rounds }) => mapper(rounds));
    const eliminationGames = elimination.flatMap(({ bouts }) => mapper(bouts));

    return [...poolGames, ...eliminationGames];
  });
}

module.exports = {
  fetchPersons,
  flattenGames,
};
