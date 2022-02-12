import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LinkButton, ResponsiveTabs } from './components';
import { get, toPersonIdMap } from './utils';
import style from './Person.module.css';

function calc({ count, wins }) {
  return Math.floor((wins / count) * 100);
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

function ResultByDate({ games, id }) {
  let byDate = [];
  games.forEach((game) => {
    const date = game.time.substring(0, 10);
    if (byDate.length === 0 || byDate[byDate.length - 1].date !== date) {
      byDate.push({ date, count: 0, wins: 0 });
    }

    const [dateObj] = byDate.slice(-1);
    game.rounds.forEach(({ l, lp, rp }) => {
      dateObj.count += 1;
      if (l === id ? lp > rp : lp < rp) {
        dateObj.wins += 1;
      }
    });
  });
  byDate = byDate.map((date) => ({ ...date, ratio: calc(date) }));

  return (
    <div className={style.byDate}>
      <div className="highlight">날짜</div>
      <div className="highlight">전적</div>
      {byDate.map(({ date, ...result }) => (
        <Fragment key={date}>
          <LinkButton size="sm" cn="mono" to={`/game/date/${date}`}>
            {date.substring(5, 10)}
          </LinkButton>
          <Result result={result} />
        </Fragment>
      ))}
    </div>
  );
}

function ResultByOpponent({ games, idMap, id }) {
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
          name: idMap.get(vs).firstName,
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
    .map((opponent) => ({ ...opponent, ratio: calc(opponent) }))
    .sort((p1, p2) => {
      if (p1.ratio !== p2.ratio) {
        return p2.ratio - p1.ratio;
      }

      return p1.name < p2.name ? -1 : 1;
    });

  return (
    <div className={style.byPerson}>
      <div className="highlight">상대</div>
      <div className="highlight">전적</div>
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

function PersonLoaded({ games, idMap, id }) {
  const { firstName, lastName } = idMap.get(id);
  return (
    <div className={style.Person}>
      <div className="header">
        {lastName}
        {firstName} 전적
      </div>
      <ResponsiveTabs tabNames={['상대별', '날짜별']} groups={[1, 1]}>
        <ResultByOpponent games={games} idMap={idMap} id={id} />
        <ResultByDate games={games} id={id} />
      </ResponsiveTabs>
    </div>
  );
}

export default function Person() {
  const [games, setGames] = useState();
  const [idMap, setIdMap] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/person/${id}`, (data) => {
      setGames(data.filter(({ type }) => type === 1));
    });
  }, [id]);

  useEffect(() => {
    get('/api/person/list', (data) => setIdMap(toPersonIdMap(data)));
  }, []);

  if (games === undefined || idMap === null) {
    return null;
  }

  return <PersonLoaded games={games} idMap={idMap} id={parseInt(id, 10)} />;
}
