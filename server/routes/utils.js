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

module.exports = {
  fetchPersons,
};
