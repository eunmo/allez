const {
  addPerson,
  editPerson,
  updateAttendance,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
} = require('./dml');
const {
  getPerson,
  getPersons,
  getGameDates,
  getGame,
  getGamesByDate,
  getPersonGames,
  getHistory,
} = require('./query');

module.exports = {
  addPerson,
  editPerson,
  updateAttendance,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
  getPerson,
  getPersons,
  getGameDates,
  getGame,
  getGamesByDate,
  getPersonGames,
  getHistory,
};
