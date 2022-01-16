const { dml } = require('@eunmo/mysql');

async function addPerson(firstName, lastName, gender, hand, grip) {
  return dml(
    'INSERT INTO person (firstName, lastName, gender, hand, grip) VALUES (?)',
    [[firstName, lastName, gender, hand, grip]]
  );
}

async function addGame(detail) {
  return dml(
    'INSERT INTO game (id, time, details) VALUES (UUID(), NOW(), ?)',
    [detail]
  );
}

async function editGame(id, detail) {
  return dml(
    'UPDATE game SET details = ? WHERE id = ?',
    [id, detail]
  );
}

async function removeGame(id) {
  return dml(
    'DELETE FROM game WHERE id = ?', [id]
  );
}

async function addParticipants(gameId, participants) {
  return dml(
    'INSERT INTO participant (personId, gameId) VALUES (?)',
    [participants.map(personId => [personId, gameId])]
  );
}

async function removeParticipants(gameId) {
  return dml(
    'DELETE FROM participant WHERE gameId = ?', [gameId]
  );
}

module.exports = { addPerson, addGame, editGame, removeGame, addParticipants, removeParticipants };
