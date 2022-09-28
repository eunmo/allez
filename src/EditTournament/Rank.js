import { Fragment } from 'react';

import { Stat } from '../components';
import style from './Rank.module.css';

export default function PoolRank({ ranking, idMap }) {
  if (ranking === undefined) {
    return null;
  }

  return (
    <div className={style.Rank}>
      <div className={`${style.header} header`}>예선 순위</div>
      <div className={style.legend}>순위</div>
      <div className={style.legend}>이름</div>
      <div className={style.legend}>승률</div>
      <div className={style.legend}>득실</div>
      <div className={style.legend}>득점</div>
      {ranking.map(({ id, rank, ratio, diff, scored }) => (
        <Fragment key={id}>
          <div className={style.rank}>{rank}</div>
          <div className={style.name}>{idMap.get(id).firstName}</div>
          <Stat value={ratio} />
          <Stat value={diff} />
          <Stat value={scored} />
        </Fragment>
      ))}
    </div>
  );
}
