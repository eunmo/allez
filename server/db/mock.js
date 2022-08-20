const { dml, query, cleanup } = require('@eunmo/mysql');
const {
  addPerson,
  addGame,
  addParticipants,
  updateAttendances,
} = require('./dml');

const personDetail1 = ['Alice', 'Last', 0, 0];
const personDetail2 = ['Bob', 'Last', 0, 2];
const personDetail3 = ['Carol', 'Last', 0, 3];
const personDetail4 = ['Dorothy', 'Last', 4, 9];
const gameDetail1 = { type: 1 };
const gameDetail2 = { type: 1 };
const gameDetail3 = { type: 2 };

async function prepare() {
  await dml('TRUNCATE TABLE person');
  await dml('TRUNCATE TABLE game');
  await dml('TRUNCATE TABLE participant');

  const { insertId: pid1 } = await addPerson(...personDetail1);
  const { insertId: pid2 } = await addPerson(...personDetail2);
  const { insertId: pid3 } = await addPerson(...personDetail3);
  const { insertId: pid4 } = await addPerson(...personDetail4);

  await updateAttendances([pid1, pid2], 0);

  gameDetail1.ls = [pid1];
  gameDetail1.rs = [pid2];
  gameDetail1.rounds = [{ l: pid1, r: pid2, lp: 5, rp: 3 }];
  const gid1 = await addGame(0, gameDetail1);
  gameDetail2.ls = [pid2];
  gameDetail2.rs = [pid3];
  gameDetail2.rounds = [{ l: pid2, r: pid3, lp: 5, rp: 3 }];
  const gid2 = await addGame(0, gameDetail2);
  gameDetail3.ls = [pid1];
  gameDetail3.rs = [pid2, pid3];
  gameDetail3.rounds = [
    { l: pid1, r: pid2, lp: 5, rp: 3 },
    { l: pid1, r: pid3, lp: 9, rp: 5 },
    { l: pid1, r: pid2, lp: 12, rp: 6 },
    { l: pid1, r: pid3, lp: 14, rp: 6 },
  ];
  const gid3 = await addGame(0, gameDetail3);

  await addParticipants(gid1, [pid1, pid2]);
  await addParticipants(gid2, [pid2, pid3]);
  await addParticipants(gid3, [pid1, pid2, pid3]);

  await dml('UPDATE game SET time = "2022-03-31 21:01:02" WHERE id = ?', [
    gid1,
  ]);
  await dml('UPDATE game SET time = "2022-04-01 21:03:04" WHERE id = ?', [
    gid2,
  ]);
  await dml('UPDATE game SET time = "2022-04-01 21:05:06" WHERE id = ?', [
    gid3,
  ]);

  const [{ gameDate: date1 }] = await query(
    'SELECT DATE(time) as gameDate FROM game WHERE id = ?',
    [gid1]
  );
  const [{ gameDate: date2 }] = await query(
    'SELECT DATE(time) as gameDate FROM game WHERE id = ?',
    [gid2]
  );

  return { pid1, pid2, pid3, pid4, gid1, gid2, gid3, date1, date2 };
}

module.exports = { prepare, cleanup };
