const { query } = require('@eunmo/mysql');

async function getPersons() {
  return query('SELECT * FROM person');
}

async function getGameDates() {
  return query(
    'SELECT distinct(date(time)) as date FROM game ORDER BY date DESC'
  );
}

async function getGamesByDate(date) {
  return query('SELECT * FROM game WHERE date(time) = ? ORDER BY time DESC', [
    date,
  ]);
}

async function getPersonGames(id) {
  return query(
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
}

async function getHistory(id1, id2) {
  return query(
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
}

module.exports = {
  getPersons,
  getGameDates,
  getGamesByDate,
  getPersonGames,
  getHistory,
};
