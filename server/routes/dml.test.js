/* eslint no-await-in-loop: 0 */

const { dml, cleanup } = require('@eunmo/mysql');
const request = require('supertest');
const app = require('../app');
const { prepare } = require('../db/mock');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE person');
  await dml('TRUNCATE TABLE game');
  await dml('TRUNCATE TABLE participant');
});

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

const baseUrl = '/api/crud';

async function del(url, body) {
  const { statusCode } = await request(app)
    .delete(`${baseUrl}/${url}`)
    .send(body);
  expect(statusCode).toBe(200);
}

async function post(url, body) {
  const { body: res, statusCode } = await request(app)
    .post(`${baseUrl}/${url}`)
    .send(body);
  expect(statusCode).toBe(200);
  return res;
}

async function put(url, body) {
  const { statusCode } = await request(app).put(`${baseUrl}/${url}`).send(body);
  expect(statusCode).toBe(200);
}

test('create person', async () => {
  const [firstName, lastName, branch, type] = ['Amy', 'Last', 0, 0];
  await post('person', { firstName, lastName, branch, type });
  const body = await get('/api/person/list');
  expect(body.length).toBe(1);

  const [person] = body;
  expect(person.firstName).toBe(firstName);
  expect(person.lastName).toBe(lastName);
  expect(person.branch).toBe(branch);
  expect(person.type).toBe(type);
});

test('edit person', async () => {
  let [firstName, lastName, branch, type] = ['Amy', 'Last', 0, 0];
  await post('person', { firstName, lastName, branch, type });
  const body = await get('/api/person/list');
  expect(body.length).toBe(1);

  let [person] = body;
  expect(person.firstName).toBe(firstName);
  expect(person.lastName).toBe(lastName);
  expect(person.branch).toBe(branch);
  expect(person.type).toBe(type);

  const { id } = person;
  [firstName, lastName, branch, type] = ['Bob', 'LastName', 1, 2];
  await put('person', { id, firstName, lastName, branch, type });

  person = await get(`/api/person/id/${id}`);
  expect(person.firstName).toBe(firstName);
  expect(person.lastName).toBe(lastName);
  expect(person.branch).toBe(branch);
  expect(person.type).toBe(type);
});

test('update attendances', async () => {
  const { pid1, pid2, pid3 } = await prepare();

  async function check(ids, values) {
    await put('attendance', { ids, branch: 1 });
    expect(values.length).toBe(3);
    let { today } = await get(`/api/person/id/${pid1}`);
    expect(today).toBe(values[0]);
    ({ today } = await get(`/api/person/id/${pid2}`));
    expect(today).toBe(values[1]);
    ({ today } = await get(`/api/person/id/${pid3}`));
    expect(today).toBe(values[2]);
  }

  await check([pid1], [1, 0, null]);
  await check([pid1, pid2], [1, 1, null]);
  await check([pid1, pid2, pid3], [1, 1, 1]);
  await check([], [null, null, null]);
});

test('reset attendances', async () => {
  const { pid1, pid2, pid3 } = await prepare();

  async function check(types, values) {
    await put('reset-attendance', { types });
    expect(values.length).toBe(3);
    let { today } = await get(`/api/person/id/${pid1}`);
    expect(today).toBe(values[0]);
    ({ today } = await get(`/api/person/id/${pid2}`));
    expect(today).toBe(values[1]);
    ({ today } = await get(`/api/person/id/${pid3}`));
    expect(today).toBe(values[2]);
  }

  await check([0], [0, null, null]);
  await check([0, 2], [0, 0, null]);
  await check([2, 3], [null, 0, 0]);
  await check([], [null, null, null]);
});

const dummyGame1 = {
  type: 1,
  ls: [1],
  rs: [2],
  rounds: [{ l: 1, lp: 5, r: 2, rp: 3 }],
};

const dummyGame1Update1 = {
  ...dummyGame1,
  rounds: [{ l: 1, lp: 5, r: 2, rp: 4 }],
};

const dummyGame1Update2 = {
  ...dummyGame1Update1,
  rs: [3],
  rounds: [{ l: 1, lp: 5, r: 3, rp: 4 }],
};

const dummyGame2 = {
  type: 2,
  ls: [1, 2],
  rs: [3, 4],
  rounds: [
    { l: 1, lp: 2, r: 4, rp: 3 },
    { l: 2, lp: 3, r: 3, rp: 2 },
    { l: 1, lp: 5, r: 3, rp: 4 },
    { l: 2, lp: 4, r: 4, rp: 6 },
  ],
};

test.each([
  [1, dummyGame1, [1, 2]],
  [2, dummyGame2, [1, 2, 3, 4]],
])('add game %d', async (_, game, pids) => {
  const { gid } = await post('game', { branch: 0, game });
  expect(gid.length).toBe(36); // uuid

  // eslint-disable-next-line no-restricted-syntax
  for (const pid of pids) {
    const { games } = await get(`/api/game/person/${pid}`);
    expect(games.length).toBe(1);
  }
});

test('update game 1', async () => {
  await post('game', { branch: 0, game: dummyGame1 });

  let {
    games: [game],
  } = await get('/api/game/person/1');
  expect(game.rounds[0].rp).toBe(3);
  const { id } = game;

  await put('game', { id, game: dummyGame1Update1 });
  ({
    games: [game],
  } = await get('/api/game/person/1'));
  expect(game.rounds[0].rp).toBe(4);
});

test('update game 2', async () => {
  await post('game', { branch: 0, game: dummyGame1 });

  let { games } = await get('/api/game/person/2');
  expect(games.length).toBe(1);
  let [game] = games;
  const { id } = game;
  expect(game.rounds[0].rp).toBe(3);

  ({ games } = await get('/api/game/person/3'));
  expect(games.length).toBe(0);

  await put('game', { id, game: dummyGame1Update2 });
  ({ games } = await get('/api/game/person/2'));
  expect(games.length).toBe(0);

  ({ games } = await get('/api/game/person/3'));
  expect(games.length).toBe(1);

  [game] = games;
  expect(game.rs).toStrictEqual([3]);
  expect(game.rounds[0].rp).toBe(4);
});

test('remove game', async () => {
  await post('game', { branch: 0, game: dummyGame1 });

  const {
    games: [{ id }],
  } = await get('/api/game/person/1');

  await del('game', { id });

  const { games } = await get('/api/game/person/1');
  expect(games.length).toBe(0);
});
