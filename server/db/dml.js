const { dml } = require('@eunmo/mysql');
const { v4: uuid } = require('uuid');

async function addPerson(firstName, lastName, branch, type) {
  return dml(
    'INSERT INTO person (firstName, lastName, branch, type) VALUES (?)',
    [[firstName, lastName, branch, type]]
  );
}

async function editPerson(id, firstName, lastName, branch, type) {
  return dml(
    `
    UPDATE person
    SET firstName = ?, lastName = ?, branch = ?, type = ?
    WHERE id = ?
    `,
    [firstName, lastName, branch, type, id]
  );
}

async function resetAttendance(types) {
  await dml('UPDATE person SET today = NULL');

  if (types.length === 0) {
    return;
  }

  await dml('UPDATE person SET today = branch WHERE type in (?)', [types]);
}

async function updateAttendances(ids, branch) {
  await dml('UPDATE person SET today = NULL WHERE today = ?', [branch]);

  if (ids.length === 0) {
    return;
  }

  await dml('UPDATE person SET today = ? WHERE id in (?)', [branch, ids]);
}

async function addGame(branch, detail) {
  const id = uuid();
  await dml('INSERT INTO game VALUES (?, NOW(), ?, ?)', [
    id,
    branch,
    JSON.stringify(detail),
  ]);
  return id;
}

async function editGame(id, detail) {
  return dml('UPDATE game SET detail = ? WHERE id = ?', [
    JSON.stringify(detail),
    id,
  ]);
}

async function removeGame(id) {
  return dml('DELETE FROM game WHERE id = ?', [id]);
}

async function addParticipants(gameId, participants) {
  return dml('INSERT INTO participant (personId, gameId) VALUES ?', [
    participants.map((personId) => [personId, gameId]),
  ]);
}

async function removeParticipants(gameId) {
  return dml('DELETE FROM participant WHERE gameId = ?', [gameId]);
}

module.exports = {
  addPerson,
  editPerson,
  resetAttendance,
  updateAttendances,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
};
