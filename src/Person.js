import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import LinkButton from './LinkButton';
import ResponsiveTab from './ResponsiveTab';
import { get, toPersonIdMap } from './utils';
import style from './Person.module.css';

function newDate(date) {
  return { date, member: { count: 0, wins: 0 }, coach: { count: 0, wins: 0 } };
}

function calc({ count, wins }) {
  return { count, wins, ratio: Math.floor((wins / count) * 100) };
}

function pad(number) {
  return `${number}`.padStart(3, '\xa0');
}

function Result({ result: { count, wins, ratio } }) {
  if (count === 0) {
    return <div />;
  }
  return (
    <div className={`${style.result} mono`}>
      {pad(ratio)}%{pad(count)}전{pad(wins)}승
    </div>
  );
}

function ResultByDate({ games, personIdMap, id }) {
  function isCoach(pid) {
    return personIdMap.get(pid).type === 'c';
  }

  let byDate = [];
  games.forEach((game) => {
    const date = game.time.substring(0, 10);
    if (byDate.length === 0 || byDate[byDate.length - 1].date !== date) {
      byDate.push(newDate(date));
    }

    const [dateObj] = byDate.slice(-1);
    game.rounds.forEach(({ l, r, lp, rp }) => {
      let target;
      let win = false;
      if (l === id) {
        target = isCoach(r) ? dateObj.coach : dateObj.member;
        win = lp > rp;
      } else {
        target = isCoach(l) ? dateObj.coach : dateObj.member;
        win = lp < rp;
      }
      target.count += 1;
      if (win) {
        target.wins += 1;
      }
    });
  });
  byDate = byDate.map(({ date, member, coach }) => ({
    date,
    member: calc(member),
    coach: calc(coach),
  }));

  return (
    <div className={style.byDate}>
      <div className={style.legend}>날짜</div>
      <div className={style.legend}>회원</div>
      <div className={style.legend}>코치</div>
      {byDate.map(({ date, member, coach }) => (
        <Fragment key={date}>
          <LinkButton
            size="sm"
            cn="mono"
            to={`/game/date/${date}`}
            style={{ fontSize: '16px' }}
          >
            {date.substring(5, 10)}
          </LinkButton>
          <Result result={member} />
          <Result result={coach} />
        </Fragment>
      ))}
    </div>
  );
}

function ResultByOpponent({ games, personIdMap, id }) {
  let byPerson = {};
  games.forEach((game) => {
    game.rounds.forEach(({ l, r, lp, rp }) => {
      const vs = l === id ? r : l;
      const win = l === id ? lp > rp : lp < rp;

      if (byPerson[vs] === undefined) {
        byPerson[vs] = {
          vs,
          count: 0,
          wins: 0,
          name: personIdMap.get(vs).firstName,
        };
      }

      const target = byPerson[vs];
      target.count += 1;
      if (win) {
        target.wins += 1;
      }
    });
  });
  byPerson = Object.values(byPerson)
    .map((opponent) => ({ ...opponent, ...calc(opponent) }))
    .sort((p1, p2) => {
      if (p1.ratio !== p2.ratio) {
        return p2.ratio - p1.ratio;
      }

      return p1.name < p2.name ? -1 : 1;
    });

  return (
    <div className={style.byPerson}>
      <div className={style.legend}>상대</div>
      <div className={style.legend}>전적</div>
      {byPerson.map((result) => (
        <Fragment key={result.vs}>
          <LinkButton size="sm" to={`/person/${result.vs}`}>
            {result.name}
          </LinkButton>
          <Result result={result} />
        </Fragment>
      ))}
    </div>
  );
}

function PersonLoaded({ games, personIdMap, id }) {
  const { firstName, lastName } = personIdMap.get(id);
  return (
    <div>
      <div className="header">
        {lastName}
        {firstName} 전적
      </div>
      <ResponsiveTab
        tabNames={['상대별', '날짜별']}
        groups={[1, 1]}
        sizes={[3, 5]}
      >
        <ResultByOpponent games={games} personIdMap={personIdMap} id={id} />
        <ResultByDate games={games} personIdMap={personIdMap} id={id} />
      </ResponsiveTab>
    </div>
  );
}

export default function Person() {
  const [games, setGames] = useState();
  const [personIdMap, setPersonIdMap] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/person/${id}`, setGames);
  }, [id]);

  useEffect(() => {
    get('/api/person/list', (data) => setPersonIdMap(toPersonIdMap(data)));
  }, []);

  if (games === undefined || personIdMap === null) {
    return null;
  }

  return (
    <PersonLoaded
      games={games}
      personIdMap={personIdMap}
      id={parseInt(id, 10)}
    />
  );
}
