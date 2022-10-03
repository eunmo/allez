import { Fragment, useMemo } from 'react';

import { getEliminationWinners, toPersonIdMap } from '../utils';
import style from './FinalRank.module.css';

function sort(p1, p2) {
  if (p1.power !== p2.power) {
    return p1.power - p2.power;
  }

  return p1.ranking - p2.ranking;
}

function formatIndexToRank(index, power) {
  return index === 3 && power === 8 ? 3 : index + 1;
}

export default function FinalRank({ ranking, rounds, idMap }) {
  const finalRanking = useMemo(() => {
    const winnerMap = getEliminationWinners(rounds, ranking);

    const persons = (ranking ?? []).map(({ id, rank }) => ({
      id,
      rank,
      power: 128,
    }));
    const personIdMap = toPersonIdMap(persons);

    Object.entries(winnerMap).forEach(([power, map]) => {
      Object.values(map).forEach((id) => {
        const person = personIdMap.get(id);
        person.power = Math.min(person.power, power);
      });
    });

    return persons.sort(sort);
  }, [ranking, rounds]);

  return (
    <div className={style.FinalRank}>
      {finalRanking.map(({ id, power }, index) => (
        <Fragment key={id}>
          <div className={style.rank}>{formatIndexToRank(index, power)}</div>
          <div className={style.name}>
            {idMap.get(id).lastName}
            {idMap.get(id).firstName}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
