const express = require('express');
const {
  addPerson,
  editPerson,
  resetAttendance,
  updateAttendances,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
  getPersonsByType,
} = require('../db');

const router = express.Router();

router.post('/person', async (req, res) => {
  const { firstName, lastName, branch, type } = req.body;
  await addPerson(firstName, lastName, branch, type);
  res.sendStatus(200);
});

router.put('/person', async (req, res) => {
  const { id, firstName, lastName, branch, type } = req.body;
  await editPerson(id, firstName, lastName, branch, type);
  res.sendStatus(200);
});

router.put('/attendance', async (req, res) => {
  const { ids, branch } = req.body;
  await updateAttendances(ids, branch);
  res.sendStatus(200);
});

router.put('/reset-attendance', async (req, res) => {
  const { types } = req.body;
  await resetAttendance(types);
  res.sendStatus(200);
});

/*
type Round = {
  l: int // pid
  lp: int // pid
  r: int // pid
  rp: int // pid
};
type Game = {
  type: 1|2|3|4|'T'
  ls: [int] // pid
  rs: [int] // pid
  rounds: [Round]
};
 */

function extractPids({ ls, rs }) {
  return [...new Set([...ls, ...rs])];
}

router.post('/game', async (req, res) => {
  const { game } = req.body;
  const pids = extractPids(game);

  const gid = await addGame(game);
  await addParticipants(gid, pids);
  res.json({ gid });
});

router.put('/game', async (req, res) => {
  const { id, game } = req.body;
  const pids = extractPids(game);

  await editGame(id, game);
  await removeParticipants(id);
  await addParticipants(id, pids);
  res.sendStatus(200);
});

router.delete('/game', async (req, res) => {
  const { id } = req.body;
  await removeGame(id);
  res.sendStatus(200);
});

module.exports = router;
