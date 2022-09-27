import { Fragment, useCallback, useState } from 'react';
import style from './Pool.module.css';

function getInputClass(value, target, selected) {
  if (target[0] === selected?.[0] && target[1] === selected?.[1]) {
    return style.selectedInput;
  }

  if (value === undefined) {
    return 'light-text';
  }

  return '';
}

export default function Pool({ pool, setPool, idMap }) {
  const [selected, setSelected] = useState();

  const toggle = useCallback(
    (index, side) => {
      if (index === selected?.[0] && side === selected?.[1]) {
        setSelected();
      } else {
        setSelected([index, side]);
      }
    },
    [selected]
  );

  const submit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const setScore = useCallback(
    (value) => {
      const { rounds, ...rest } = pool;
      const [index, side] = selected;
      const newRounds = [...rounds];
      newRounds[index][side] = value;
      setPool({ ...rest, rounds: newRounds });
      setSelected();
    },
    [pool, selected, setPool]
  );

  const { rounds } = pool;

  return (
    <div className={style.Pool}>
      <div className="header">예선전 진행</div>
      <form onSubmit={submit}>
        <label className={style.header}>선수</label>
        <label className={style.header}>득점</label>
        <label className={style.header}>순서</label>
        <label className={style.header}>득점</label>
        <label className={style.header}>선수</label>
        {rounds.map(({ l, r, lp, rp }, index) => (
          <Fragment
            /* eslint-disable-next-line react/no-array-index-key */
            key={index}
          >
            <label>{idMap.get(l).firstName}</label>
            <input
              type="button"
              value={lp ?? '입력'}
              className={getInputClass(lp, [index, 'lp'], selected)}
              onClick={() => toggle(index, 'lp')}
            />
            <label className="light-text">{index + 1}</label>
            <input
              type="button"
              value={rp ?? '입력'}
              className={getInputClass(rp, [index, 'rp'], selected)}
              onClick={() => toggle(index, 'rp')}
            />
            <label>{idMap.get(r).firstName}</label>
            {selected?.[0] === index && (
              <div className={style.PointInput}>
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <input
                    type="button"
                    key={value}
                    value={value}
                    onClick={() => setScore(value)}
                  />
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </form>
    </div>
  );
}
