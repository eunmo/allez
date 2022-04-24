USE allez;

DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS game;

CREATE TABLE person (
  id SMALLINT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  branch SMALLINT NOT NULL,
  type SMALLINT NOT NULL,
  today SMALLINT DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE game (
  id CHAR(36) NOT NULL,
  time DATETIME NOT NULL,
  detail JSON NOT NULL,
  PRIMARY KEY (id),
  KEY (time)
);

CREATE TABLE participant (
  personId SMALLINT NOT NULL,
  gameId CHAR(36) NOT NULL,
  CONSTRAINT participant_person_fk FOREIGN KEY (personId) REFERENCES person(id) ON DELETE CASCADE,
  CONSTRAINT participant_game_fk FOREIGN KEY (gameId) REFERENCES game(id) ON DELETE CASCADE
);
