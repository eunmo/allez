import { Fragment, useEffect, useMemo, useState } from 'react';

import { LinkButton, Stat } from './components';
import { get, toPersonIdMap } from './utils';
import style from './Rank.module.css';

const keys = {
  date: { title: '출석왕', legend: '출석' },
  wins: { title: '다승왕', legend: '승리' },
  points: { title: '득점왕', legend: '득점' },
  diff: { title: '득실왕', legend: '득실' },
};

function RankTable({ ranking, idMap, title, children }) {
  const [sortKey, setSortKey] = useState('date');

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

  return (
    <div className={style.RankTable}>
      <div className={`${style.title} header`}>
        {title} {keys[sortKey].title}
      </div>
      {children}
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
            <Stat key={key} value={person[key]} pad={padding.get(key)} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export default function Rank() {
  const [rankings, setRankings] = useState();
  const [idMap, setIdMap] = useState();
  const [selectedRank, setSelectedRank] = useState();

  useEffect(() => {
    get('/api/rank', ({ ranks, monthlyRanks, persons }) => {
      const formatted = [
        ...monthlyRanks.map((monthlyRank) => {
          const { month } = monthlyRank;
          const title = `${parseInt(month.substring(5, 7), 10)}월`;
          return { title, ranks: monthlyRank.ranks };
        }),
        { title: '전체', ranks },
      ];
      setRankings(formatted);
      setSelectedRank(formatted[0]);
      setIdMap(toPersonIdMap(persons));
    });
  }, []);

  if (
    rankings === undefined ||
    idMap === undefined ||
    selectedRank === undefined
  ) {
    return null; // TODO: spinner
  }

  const { title, ranks } = selectedRank;

  return (
    <RankTable ranking={ranks} idMap={idMap} title={title}>
      <div className={style.months}>
        {rankings.map((ranking) => (
          <button
            key={ranking.title}
            type="button"
            className={style.button}
            onClick={() => setSelectedRank(ranking)}
            disabled={selectedRank === ranking}
          >
            {ranking.title}
          </button>
        ))}
      </div>
    </RankTable>
  );
}
