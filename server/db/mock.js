const { dml, query, cleanup } = require('@eunmo/mysql');
const {
  addPerson,
  addGame,
  addParticipants,
  updateAttendances,
} = require('./dml');

const personDetail1 = ['Alice', 'Last', 'f'];
const personDetail2 = ['Bob', 'Last', 'm'];
const personDetail3 = ['Carol', 'Last', 'c'];
const gameDetail1 = { name: 'g1' };
const gameDetail2 = { name: 'g2' };
const gameDetail3 = { name: 'g3' };
let pid1;
let pid2;
let pid3;
let gid1;
let gid2;
let gid3;
let date1;
let date2;

async function prepare() {
  await dml('TRUNCATE TABLE person');
  await dml('TRUNCATE TABLE game');
  await dml('TRUNCATE TABLE participant');

  ({ insertId: pid1 } = await addPerson(...personDetail1));
  ({ insertId: pid2 } = await addPerson(...personDetail2));
  ({ insertId: pid3 } = await addPerson(...personDetail3));

  await updateAttendances([pid1, pid2]);

  gid1 = await addGame(gameDetail1);
  gid2 = await addGame(gameDetail2);
  gid3 = await addGame(gameDetail3);

  await addParticipants(gid1, [pid1, pid2]);
  await addParticipants(gid2, [pid2, pid3]);
  await addParticipants(gid3, [pid1, pid2, pid3]);

  await dml(
    'UPDATE game SET time = DATE_SUB(time, INTERVAL 1 DAY) WHERE id = ?',
    [gid1]
  );
  await dml(
    'UPDATE game SET time = DATE_ADD(time, INTERVAL 1 SECOND) WHERE id = ?',
    [gid3]
  );

  [{ gameDate: date1 }] = await query(
    'SELECT DATE(time) as gameDate FROM game WHERE id = ?',
    [gid1]
  );
  [{ gameDate: date2 }] = await query(
    'SELECT DATE(time) as gameDate FROM game WHERE id = ?',
    [gid2]
  );

  return { pid1, pid2, pid3, gid1, gid2, gid3, date1, date2 };
}

module.exports = { prepare, cleanup };
