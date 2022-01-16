const { dml, query, cleanup } = require('@eunmo/mysql');
const { addPerson, addGame, addParticipants } = require('./dml');
const {
  getPersons,
  getGameDates,
  getGamesByDate,
  getPersonGames,
  getHistory,
} = require('./query');

afterAll(async () => {
  await cleanup();
});

const personDetail1 = ['Alice', 'Last', 'f', 'r', 'f'];
const personDetail2 = ['Bob', 'Last', 'm', 'r', 'p'];
const personDetail3 = ['Carol', 'Last', 'f', 'l', 'f'];
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

beforeAll(async () => {
  await dml('TRUNCATE TABLE person');
  await dml('TRUNCATE TABLE game');
  await dml('TRUNCATE TABLE participant');

  ({ insertId: pid1 } = await addPerson(...personDetail1));
  ({ insertId: pid2 } = await addPerson(...personDetail2));
  ({ insertId: pid3 } = await addPerson(...personDetail3));

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
});

test('get persons', async () => {
  const rows = await getPersons();
  expect(rows.length).toBe(3);
});

test('get game dates', async () => {
  const rows = await getGameDates();
  expect(rows.length).toBe(2);
  expect(rows[0].date).toStrictEqual(date2);
  expect(rows[1].date).toStrictEqual(date1);
});

test('get games by date', async () => {
  async function check(date, gids) {
    const rows = await getGamesByDate(date);
    expect(rows.length).toBe(gids.length);
    expect(rows.map((r) => r.id)).toStrictEqual(gids);
  }

  await check(date1, [gid1]);
  await check(date2, [gid3, gid2]);
});

test('get person games', async () => {
  async function check(pid, gids) {
    const rows = await getPersonGames(pid);
    expect(rows.length).toBe(gids.length);
    expect(rows.map((r) => r.id)).toStrictEqual(gids);
  }

  await check(pid1, [gid3, gid1]);
  await check(pid2, [gid3, gid2, gid1]);
  await check(pid3, [gid3, gid2]);
});

test('get history', async () => {
  async function check(pids, gids) {
    const rows = await getHistory(...pids);
    expect(rows.length).toBe(gids.length);
    expect(rows.map((r) => r.id)).toStrictEqual(gids);
  }

  await check([pid1, pid2], [gid3, gid1]);
  await check([pid1, pid3], [gid3]);
  await check([pid2, pid1], [gid3, gid1]);
  await check([pid2, pid3], [gid3, gid2]);
  await check([pid3, pid1], [gid3]);
  await check([pid3, pid2], [gid3, gid2]);
});
