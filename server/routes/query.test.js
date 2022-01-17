const request = require('supertest');
const { prepare, cleanup } = require('../db/mock');
const app = require('../app');

afterAll(async () => {
  await cleanup();
});

let pid1;
let pid2;
let pid3;
let gid1;
let gid2;
let gid3;
let date1;
let date2;

beforeAll(async () => {
  ({ pid1, pid2, pid3, gid1, gid2, gid3, date1, date2 } = await prepare());
});

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

test('get all persons', async () => {
  const body = await get('/api/person/list');
  expect(body.length).toBe(3);
});

test('get game dates', async () => {
  const body = await get('/api/game/dates');
  expect(body.length).toBe(2);
  expect(body.map((e) => new Date(e.date))).toStrictEqual([date2, date1]);
});

test('get games by date', async () => {
  async function check(date, gids) {
    const dateString = date.toISOString().substring(0, 10);
    const body = await get(`/api/game/date/${dateString}`);
    expect(body.length).toBe(gids.length);
    expect(body.map((g) => g.id)).toStrictEqual(gids);
  }

  await check(date1, [gid1]);
  await check(date2, [gid3, gid2]);
});

test('get games by pid', async () => {
  async function check(pid, gids) {
    const body = await get(`/api/game/person/${pid}`);
    expect(body.length).toBe(gids.length);
    expect(body.map((g) => g.id)).toStrictEqual(gids);
  }

  await check(pid1, [gid3, gid1]);
  await check(pid2, [gid3, gid2, gid1]);
  await check(pid3, [gid3, gid2]);
});

test('get history', async () => {
  async function check(pid1, pid2, gids) {
    const body = await get(`/api/game/history/${pid1}/${pid2}`);
    expect(body.length).toBe(gids.length);
    expect(body.map((g) => g.id)).toStrictEqual(gids);
  }

  await check(pid1, pid2, [gid3, gid1]);
  await check(pid1, pid3, [gid3]);
  await check(pid2, pid1, [gid3, gid1]);
  await check(pid2, pid3, [gid3, gid2]);
  await check(pid3, pid1, [gid3]);
  await check(pid3, pid2, [gid3, gid2]);
});
