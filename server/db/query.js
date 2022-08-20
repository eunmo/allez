const { query } = require('@eunmo/mysql');

function getPersons() {
  return query('SELECT * FROM person');
}

function getPersonsById(ids) {
  return query('SELECT * FROM person WHERE id in (?)', [ids]);
}

function getToday(branch) {
  return query(
    'SELECT id, firstName, lastName, type FROM person WHERE today = ?',
    [branch]
  );
}

function getTodayByType(branch, type) {
  return query(
    `
    SELECT id, firstName, lastName, type
    FROM person
    WHERE today = ?
    AND type = ?
    `,
    [branch, type]
  );
}

async function getPerson(id) {
  const rows = await query('SELECT * FROM person WHERE id = ?', [id]);
  const [person] = rows;
  return person ?? null;
}

async function getGameDates(branch) {
  return query(
    `
    SELECT distinct(date(time)) as date
    FROM game
    WHERE branch = ?
    ORDER BY date DESC
    `,
    [branch]
  );
}

function parseGameRows(rows) {
  return rows.map(({ detail, ...rest }) => ({
    ...rest,
    ...JSON.parse(detail),
  }));
}

async function getGame(id) {
  const rows = await query('SELECT * FROM game WHERE id = ?', [id]);

  const [game] = parseGameRows(rows);

  return game ?? null;
}

async function getGames(branch) {
  const rows = await query(
    'SELECT * FROM game WHERE branch = ? ORDER BY time DESC',
    [branch]
  );

  return parseGameRows(rows);
}

async function getGamesByDate(branch, date) {
  const rows = await query(
    `
    SELECT *
    FROM game
    WHERE branch = ? AND date(time) = ?
    ORDER BY time DESC
    `,
    [branch, date]
  );

  return parseGameRows(rows);
}

async function getPersonGames(id) {
  const rows = await query(
    `
    SELECT *
    FROM game g
    WHERE g.id IN (
      SELECT gameId
      FROM participant
      WHERE personId = ?
    )
    ORDER BY time DESC
    `,
    [id]
  );

  return parseGameRows(rows);
}

async function getHistory(id1, id2) {
  const rows = await query(
    `
    SELECT *
    FROM game g
    WHERE g.id IN (
      SELECT p1.gameId
      FROM participant p1, participant p2
      WHERE p1.gameId = p2.gameId
      AND p1.personId = ?
      AND p2.personId = ?
    )
    ORDER BY time DESC
    `,
    [id1, id2]
  );

  return parseGameRows(rows).filter(({ type }) => type === 1);
}

module.exports = {
  getPersons,
  getPersonsById,
  getToday,
  getTodayByType,
  getPerson,
  getGameDates,
  getGame,
  getGames,
  getGamesByDate,
  getPersonGames,
  getHistory,
};
