import { Fragment, useMemo } from 'react';

import { Score } from '../components';
import { getEliminationWinners, eliminationRoundNames } from '../utils';
import style from './Elimination.module.css';

function getNameClass(id, win, bye) {
  if (id === undefined) {
    return 'light-text';
  }

  if (win || bye) {
    return 'highlight';
  }

  return '';
}

function Bout({ power, bout, winnerMap, idMap, size }) {
  const l = useMemo(() => {
    const { lr } = bout;
    let { l: id } = bout;

    if (id === undefined) {
      /* eslint-disable-next-line no-bitwise */
      const lower = winnerMap[power << 1]?.[lr];
      if (lower !== undefined) {
        id = lower;
      }
    }
    return id;
  }, [bout, winnerMap, power]);

  const r = useMemo(() => {
    const { rr } = bout;
    let { r: id } = bout;

    if (id === undefined) {
      /* eslint-disable-next-line no-bitwise */
      const lower = winnerMap[power << 1]?.[rr];
      if (lower !== undefined) {
        id = lower;
      }
    }
    return id;
  }, [bout, winnerMap, power]);

  const { lp, rp, lr, rr } = bout;

  const lName = idMap.get(l)?.firstName ?? (lr > size ? '시드' : '미정');
  const rName = idMap.get(r)?.firstName ?? (rr > size ? '시드' : '미정');

  return (
    <>
      <label className="light-text">{lr}</label>
      <label className={getNameClass(l, lp > rp, rr > size)}>{lName}</label>
      <Score scores={[lp, rp]} />
      <Score scores={[rp, lp]} />
      <label className={getNameClass(r, rp > lp, lr > size)}>{rName}</label>
      <label className="light-text">{rr}</label>
    </>
  );
}

export default function Elimination({ ranking, rounds, idMap }) {
  const size = useMemo(() => ranking?.length, [ranking]);

  const winnerMap = useMemo(
    () => getEliminationWinners(rounds, ranking),
    [ranking, rounds]
  );

  const reversed = useMemo(() => [...rounds].reverse(), [rounds]);

  if (ranking === undefined) {
    return null;
  }

  return (
    <div className={style.Elimination}>
      {reversed.map(({ power, bouts }) => (
        <Fragment key={power}>
          <div className={style.round}>{eliminationRoundNames[power]}</div>
          <label className="light-text">시드</label>
          <label className="light-text">선수</label>
          <label className="light-text">득점</label>
          <label className="light-text">득점</label>
          <label className="light-text">선수</label>
          <label className="light-text">시드</label>
          {bouts.map((bout) => (
            <Bout
              key={`${power} ${bout.lr}`}
              power={power}
              bout={bout}
              winnerMap={winnerMap}
              idMap={idMap}
              size={size}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
