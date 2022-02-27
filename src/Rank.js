import { Fragment, useEffect, useMemo, useState } from 'react';

import { LinkButton } from './components';
import { get, toPersonIdMap } from './utils';
import style from './Rank.module.css';

const keys = {
  date: { title: '출석왕', legend: '출석' },
  wins: { title: '다승왕', legend: '승리' },
  points: { title: '득점왕', legend: '득점' },
  diff: { title: '득실왕', legend: '득실' },
};

export default function Rank() {
  const [ranking, setRanking] = useState();
  const [idMap, setIdMap] = useState();
  const [sortKey, setSortKey] = useState('date');

  useEffect(() => {
    get('/api/rank', ({ ranks, persons }) => {
      setRanking(ranks);
      setIdMap(toPersonIdMap(persons));
    });
  }, []);

  const [ranked, padding] = useMemo(() => {
    if (ranking === undefined || idMap === undefined) {
      return [];
    }

    const sorted = ranking.sort((a, b) => {
      if (a[sortKey] !== b[sortKey]) {
        return b[sortKey] - a[sortKey];
      }

      return idMap.get(a.id).firstName < idMap.get(b.id).firstName ? -1 : 1;
    });

    let prevRank = 1;
    const withRank = sorted.map((person, index) => {
      let rank = index + 1;
      if (sorted[index - 1]?.[sortKey] === person[sortKey]) {
        rank = prevRank;
      } else {
        prevRank = rank;
      }

      return { ...person, rank };
    });

    const widths = new Map(
      Object.keys(keys).map((key) => [
        key,
        Math.max(...ranking.map((rank) => rank[key].toString().length)),
      ])
    );
    return [withRank, widths];
  }, [ranking, idMap, sortKey]);

  if (ranking === undefined || idMap === undefined) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.Rank}>
      <div className={`${style.title} header`}>{keys[sortKey].title}</div>
      <div className="light-text">순위</div>
      <div className="light-text">이름</div>
      {Object.entries(keys).map(([key, { legend }]) => (
        <button
          type="button"
          key={key}
          className={style.button}
          onClick={() => setSortKey(key)}
          disabled={sortKey === key}
        >
          {legend}
        </button>
      ))}
      {ranked.map((person) => (
        <Fragment key={person.id}>
          <div className="mono">{person.rank}</div>
          <LinkButton size="sm" to={`/person/${person.id}`}>
            {idMap.get(person.id).firstName}
          </LinkButton>
          {Object.keys(keys).map((key) => (
            <div key={key} className="mono">
              {`${person[key]}`.padStart(padding.get(key), '\xa0')}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
