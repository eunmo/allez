const {
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
} = require('./query');
const { prepare, cleanup } = require('./mock');

afterAll(async () => {
  await cleanup();
});

let pid1;
let pid2;
let pid3;
let pid4;
let gid1;
let gid2;
let gid3;
let date1;
let date2;

beforeAll(async () => {
  ({ pid1, pid2, pid3, pid4, gid1, gid2, gid3, date1, date2 } =
    await prepare());
});

test('get persons', async () => {
  const rows = await getPersons();
  expect(rows.length).toBe(4);
  expect(rows[0].today).toBe(0);
  expect(rows[1].today).toBe(0);
  expect(rows[2].today).toBe(null);
  expect(rows[3].today).toBe(null);
});

test('get persons by id', async () => {
  const rows = await getPersonsById([pid1, pid2]);
  expect(rows.length).toBe(2);
  expect(rows.map(({ id }) => id)).toStrictEqual([pid1, pid2]);
});

test('get today', async () => {
  let rows = await getToday(0);
  expect(rows.length).toBe(2);

  rows = await getToday(1);
  expect(rows.length).toBe(0);
});

test('get today by type', async () => {
  const rows = await getTodayByType(0, 0);
  expect(rows.length).toBe(1);
  expect(rows[0].firstName).toBe('Alice');
});

test('get person', async () => {
  const row = await getPerson(pid1);
  expect(row.id).toBe(pid1);
  expect(row.today).toBe(0);
});

test('get unknown person', async () => {
  const row = await getPerson(pid4 + 1);
  expect(row).toBe(null);
});

test('get game dates', async () => {
  const rows = await getGameDates(0);
  expect(rows.length).toBe(2);
  expect(rows[0].date).toStrictEqual(date2);
  expect(rows[1].date).toStrictEqual(date1);
});

test('get game', async () => {
  const row = await getGame(gid1);
  expect(row.id).toBe(gid1);
});

test('get unknown game', async () => {
  const row = await getGame(`${gid1}!`);
  expect(row).toBe(null);
});

test('get all games', async () => {
  const gids = [gid3, gid2, gid1];
  const rows = await getGames(0);
  expect(rows.length).toBe(gids.length);
  expect(rows.map((r) => r.id)).toStrictEqual(gids);
});

test('get games by date', async () => {
  async function check(date, gids) {
    const rows = await getGamesByDate(0, date);
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

  await check([pid1, pid2], [gid1]);
  await check([pid1, pid3], []);
  await check([pid2, pid1], [gid1]);
  await check([pid2, pid3], [gid2]);
  await check([pid3, pid1], []);
  await check([pid3, pid2], [gid2]);
});
