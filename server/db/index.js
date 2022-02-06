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
  getToday,
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
  getToday,
  getPersons,
  getGameDates,
  getGame,
  getGamesByDate,
  getPersonGames,
  getHistory,
};
