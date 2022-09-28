import { Fragment, useCallback, useMemo, useState } from 'react';

import { getEliminationWinners, eliminationRoundNames } from '../utils';
import style from './Elimination.module.css';

function getInputClass(value, target, selected) {
  if (target === selected) {
    return style.selectedInput;
  }

  if (value === undefined) {
    return 'light-text';
  }

  return '';
}

function Bout({ power, bout, setBout, winnerMap, idMap, size }) {
  const [selected, setSelected] = useState();
  const toggle = useCallback(
    (side) => {
      if (side === selected) {
        setSelected();
      } else {
        setSelected(side);
      }
    },
    [selected]
  );

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

  const setScore = useCallback(
    (value) => {
      if (selected === undefined) {
        return;
      }

      const newBout = { ...bout, l, r };
      newBout[selected] = value;
      setBout(newBout);
      setSelected();
    },
    [bout, l, r, selected, setBout]
  );

  const { lp, rp, lr, rr } = bout;
  const lName = idMap.get(l)?.firstName ?? (lr > size ? '부전승' : '미정');
  const rName = idMap.get(r)?.firstName ?? (rr > size ? '부전승' : '미정');

  return (
    <>
      <label className="light-text">{lr}</label>
      <label className={l === undefined ? 'light-text' : ''}>{lName}</label>
      {l && r ? (
        <>
          <input
            type="button"
            value={lp ?? '입력'}
            className={getInputClass(lp, 'lp', selected)}
            onClick={() => toggle('lp')}
          />
          <input
            type="button"
            value={rp ?? '입력'}
            className={getInputClass(rp, 'rp', selected)}
            onClick={() => toggle('rp')}
          />
        </>
      ) : (
        <>
          <div />
          <div />
        </>
      )}
      <label className={r === undefined ? 'light-text' : ''}>{rName}</label>
      <label className="light-text">{rr}</label>
      {selected !== undefined && (
        <>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
            (value) => (
              <input
                type="button"
                key={value}
                value={value}
                className={style[`pointInput${value}`]}
                onClick={() => setScore(value)}
              />
            )
          )}
          <div />
        </>
      )}
    </>
  );
}

export default function Elimination({ ranking, rounds, setRounds, idMap }) {
  const size = useMemo(() => ranking?.length, [ranking]);

  const winnerMap = useMemo(
    () => getEliminationWinners(rounds, ranking),
    [ranking, rounds]
  );

  const setBout = useCallback(
    (newBout, roundIndex, boutIndex) => {
      const newRounds = rounds.map((round, i1) => {
        if (roundIndex === i1) {
          const { bouts, ...rest } = round;
          return {
            ...rest,
            bouts: bouts.map((bout, i2) => (boutIndex === i2 ? newBout : bout)),
          };
        }
        return round;
      });
      setRounds(newRounds);
    },
    [rounds, setRounds]
  );

  if (ranking === undefined) {
    return null;
  }

  return (
    <div className={style.Elimination}>
      {rounds.map(({ power, bouts }, roundIndex) => (
        <Fragment key={power}>
          <div className={style.round}>{eliminationRoundNames[power]}</div>
          <label className={style.label}>시드</label>
          <label className={style.label}>선수</label>
          <label className={style.label}>득점</label>
          <label className={style.label}>득점</label>
          <label className={style.label}>선수</label>
          <label className={style.label}>시드</label>
          {bouts.map((bout, boutIndex) => (
            <Bout
              key={`${power} ${bout.lr}`}
              power={power}
              bout={bout}
              setBout={(newBout) => setBout(newBout, roundIndex, boutIndex)}
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
