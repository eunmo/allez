const request = require('supertest');
const { prepare, cleanup } = require('../db/mock');
const app = require('../app');

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

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

test('get all persons', async () => {
  const body = await get('/api/person/list');
  expect(body.length).toBe(4);
});

test('get all persons attending today', async () => {
  let body = await get('/api/person/today/0');
  expect(body.length).toBe(2);

  body = await get('/api/person/today/1');
  expect(body.length).toBe(0);

  body = await get('/api/person/today/4');
  expect(body.length).toBe(1);
  expect(body[0].id).toBe(pid1);
});

test('get one person', async () => {
  const person = await get(`/api/person/id/${pid1}`);
  expect(person.id).toBe(pid1);
});

test('get unknown person', async () => {
  const person = await get(`/api/person/id/${pid4 + 1}`);
  expect(person).toBe(null);
});

test('get game dates', async () => {
  const body = await get('/api/game/dates/0');
  expect(body.length).toBe(2);
  expect(body.map((e) => new Date(e.date))).toStrictEqual([date2, date1]);
});

test('get one game', async () => {
  const { game, persons } = await get(`/api/game/id/${gid1}`);
  expect(game.id).toBe(gid1);
  expect(persons.length).toBe(2);
});

test('get unknown game', async () => {
  const { game, persons } = await get(`/api/game/id/${gid1}!`);
  expect(game).toBe(null);
  expect(persons.length).toBe(0);
});

test('get games by date', async () => {
  async function check(date, gids, personLength) {
    const dateString = date.toISOString().substring(0, 10);
    const { games, persons } = await get(`/api/game/date/0/${dateString}`);
    expect(games.length).toBe(gids.length);
    expect(games.map((g) => g.id)).toStrictEqual(gids);
    expect(persons.length).toBe(personLength);
  }

  await check(date1, [gid1], 2);
  await check(date2, [gid3, gid2], 3);
});

test('get games for today', async () => {
  async function check(date, gids, personLength) {
    const dateString = date.toISOString().substring(0, 10);
    const { games, persons } = await get(`/api/game/today/0/${dateString}`);
    expect(games.length).toBe(gids.length);
    expect(games.map((g) => g.id)).toStrictEqual(gids);
    expect(persons.length).toBe(personLength);
  }

  await check(date1, [gid1], 2);
  await check(date2, [gid3, gid2], 3);
});

test('get games by pid', async () => {
  async function check(pid, gids) {
    const { games } = await get(`/api/game/person/${pid}`);
    expect(games.length).toBe(gids.length);
    expect(games.map((g) => g.id)).toStrictEqual(gids);
  }

  await check(pid1, [gid3, gid1]);
  await check(pid2, [gid3, gid2, gid1]);
  await check(pid3, [gid3, gid2]);
});

test('get summary by pid', async () => {
  async function check(pid, dateCount, dateCounts, dateWins, person) {
    const { persons, byDate, byPerson } = await get(
      `/api/person/summary/${pid}`
    );
    expect(persons.length).toBe(3);
    expect(byDate.length).toBe(dateCount);
    expect(byDate.map(({ count }) => count)).toStrictEqual(dateCounts);
    expect(byDate.map(({ wins }) => wins)).toStrictEqual(dateWins);
    expect(byPerson).toStrictEqual(person);
  }

  /* Day 2
   * p2 5 : 3 p3
   * p1 14 : 6 p2+p3
   * Day 1
   * p1 5: 3 p2 */

  const p1 = { [pid2]: { count: 1, wins: 1, latest: '2022-03-31' } };
  await check(pid1, 2, [1, 1], [1, 1], p1);
  const p2 = {
    [pid1]: { count: 1, wins: 0, latest: '2022-03-31' },
    [pid3]: { count: 1, wins: 1, latest: '2022-04-01' },
  };
  await check(pid2, 2, [2, 1], [1, 0], p2);
  const p3 = { [pid2]: { count: 1, wins: 0, latest: '2022-04-01' } };
  await check(pid3, 1, [2], [0], p3);
});

test('get history', async () => {
  async function check(pidA, pidB, gids) {
    const { games, persons } = await get(`/api/game/history/${pidA}/${pidB}`);
    expect(games.length).toBe(gids.length);
    expect(games.map((g) => g.id)).toStrictEqual(gids);
    expect(persons.length).toBe(2);
  }

  await check(pid1, pid2, [gid1]);
  await check(pid1, pid3, []);
  await check(pid2, pid1, [gid1]);
  await check(pid2, pid3, [gid2]);
  await check(pid3, pid1, []);
  await check(pid3, pid2, [gid2]);
});

test('get rank', async () => {
  const { ranks, monthlyRanks, persons } = await get('/api/rank/0');

  expect(persons.length).toBe(4);
  expect(ranks.length).toBe(3);
  expect(ranks.find(({ id }) => id === pid1)).toStrictEqual({
    id: pid1,
    date: 2,
    wins: 2,
    points: 19,
    diff: 10,
  });
  expect(ranks.find(({ id }) => id === pid2)).toStrictEqual({
    id: pid2,
    date: 2,
    wins: 1,
    points: 12,
    diff: -4,
  });
  expect(ranks.find(({ id }) => id === pid3)).toStrictEqual({
    id: pid3,
    date: 1,
    wins: 0,
    points: 5,
    diff: -6,
  });

  expect(monthlyRanks.length).toBe(2);
  const [april, march] = monthlyRanks;

  // check sort
  expect(april.month).toStrictEqual('2022-04');
  expect(march.month).toStrictEqual('2022-03');

  // check monthly ranks
  expect(march.ranks.length).toBe(2);
  expect(march.ranks.find(({ id }) => id === pid1)).toStrictEqual({
    id: pid1,
    date: 1,
    wins: 1,
    points: 5,
    diff: 2,
  });
  expect(march.ranks.find(({ id }) => id === pid2)).toStrictEqual({
    id: pid2,
    date: 1,
    wins: 0,
    points: 3,
    diff: -2,
  });

  expect(april.ranks.length).toBe(3);
  expect(april.ranks.find(({ id }) => id === pid1)).toStrictEqual({
    id: pid1,
    date: 1,
    wins: 1,
    points: 14,
    diff: 8,
  });
  expect(april.ranks.find(({ id }) => id === pid2)).toStrictEqual({
    id: pid2,
    date: 1,
    wins: 1,
    points: 9,
    diff: -2,
  });
  expect(april.ranks.find(({ id }) => id === pid3)).toStrictEqual({
    id: pid3,
    date: 1,
    wins: 0,
    points: 5,
    diff: -6,
  });
});
