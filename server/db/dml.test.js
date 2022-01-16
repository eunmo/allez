const { dml, query, cleanup } = require('@eunmo/mysql');
const {
  addPerson,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
} = require('./dml');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE person');
  await dml('TRUNCATE TABLE game');
  await dml('TRUNCATE TABLE participant');
});

test('add one person', async () => {
  await addPerson('First', 'Last', 'm', 'r', 'p');
  const rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(1);
});

test('add one game', async () => {
  const detail = { dummy: 'dummy' };
  const id = await addGame(detail);
  const rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);
  expect(JSON.parse(rows[0].detail)).toStrictEqual(detail);
});

test('update one game', async () => {
  const detail = { dummy: 'dummy' };
  const id = await addGame(detail);
  let rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);
  expect(JSON.parse(rows[0].detail)).toStrictEqual(detail);

  detail.dummy = 'dummy2';
  await editGame(id, detail);

  rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);
  expect(JSON.parse(rows[0].detail)).toStrictEqual(detail);
});

test('remove one game', async () => {
  const detail = { dummy: 'dummy' };
  const id = await addGame(detail);
  let rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  await removeGame(id);
  rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(0);
});

test('add participant', async () => {
  const { insertId: personId } = await addPerson(
    'First',
    'Last',
    'm',
    'r',
    'p'
  );
  const detail = { dummy: 'dummy' };
  const gameId = await addGame(detail);

  await addParticipants(gameId, [personId]);
  const rows = await query('SELECT * FROM participant');
  expect(rows.length).toBe(1);
});

test('remove participant', async () => {
  const { insertId: personId } = await addPerson(
    'First',
    'Last',
    'm',
    'r',
    'p'
  );
  const detail = { dummy: 'dummy' };
  const gameId = await addGame(detail);

  await addParticipants(gameId, [personId]);
  let rows = await query('SELECT * FROM participant');
  expect(rows.length).toBe(1);

  await removeParticipants(gameId);
  rows = await query('SELECT * FROM participant');
  expect(rows.length).toBe(0);
});
