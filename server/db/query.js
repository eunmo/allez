const { query } = require('@eunmo/mysql');

function parsePersonRows(rows) {
  return rows.map((row) => ({ ...row, today: row.today === 1 }));
}

async function getPersons() {
  const rows = await query('SELECT * FROM person');
  return parsePersonRows(rows);
}

async function getPersonIdsByType(types) {
  if (types.length === 0) {
    return [];
  }
  return query('SELECT id FROM person WHERE type in (?)', [types]);
}

async function getToday() {
  const rows = await query(
    'SELECT id, firstName, lastName, type FROM person WHERE today = TRUE'
  );
  return parsePersonRows(rows);
}

async function getPerson(id) {
  const rows = await query('SELECT * FROM person WHERE id = ?', [id]);
  const [person] = parsePersonRows(rows);
  return person ?? null;
}

async function getGameDates() {
  return query(
    'SELECT distinct(date(time)) as date FROM game ORDER BY date DESC'
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

async function getGames() {
  const rows = await query('SELECT * FROM game ORDER BY time DESC');

  return parseGameRows(rows);
}

async function getGamesByDate(date) {
  const rows = await query(
    'SELECT * FROM game WHERE date(time) = ? ORDER BY time DESC',
    [date]
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

  return parseGameRows(rows);
}

module.exports = {
  getPersons,
  getPersonIdsByType,
  getToday,
  getPerson,
  getGameDates,
  getGame,
  getGames,
  getGamesByDate,
  getPersonGames,
  getHistory,
};
