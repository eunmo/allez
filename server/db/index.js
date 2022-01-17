const {
  addPerson,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
} = require('./dml');
const {
  getPersons,
  getGameDates,
  getGamesByDate,
  getPersonGames,
  getHistory,
} = require('./query');

module.exports = {
  addPerson,
  addGame,
  editGame,
  removeGame,
  addParticipants,
  removeParticipants,
  getPersons,
  getGameDates,
  getGamesByDate,
  getPersonGames,
  getHistory,
};
