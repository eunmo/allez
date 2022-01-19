const { dml } = require('@eunmo/mysql');
const { v4: uuid } = require('uuid');

async function addPerson(firstName, lastName, type) {
  return dml('INSERT INTO person (firstName, lastName, type) VALUES (?)', [
    [firstName, lastName, type],
  ]);
}

async function editPerson(id, firstName, lastName, type) {
  return dml(
    'UPDATE person SET firstName = ?, lastName = ?, type = ?  WHERE id = ?',
    [firstName, lastName, type, id]
  );
}

async function updateAttendance(ids) {
  await dml('UPDATE person set today = FALSE');

  if (ids.length === 0) {
    return;
  }

  await dml('UPDATE person SET today = TRUE WHERE id in (?)', [ids]);
}

async function addGame(detail) {
  const id = uuid();
  await dml('INSERT INTO game (id, time, detail) VALUES (?, NOW(), ?)', [
    id,
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
  updateAttendance,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
};
