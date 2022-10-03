import { Fragment, useMemo } from 'react';

import { useBranch } from '../BranchContext';
import { LinkButton } from '../components';
import style from './Pools.module.css';

function Grid({ pool, idMap }) {
  const { branch } = useBranch();

  const grid = useMemo(() => {
    const { participants, rounds } = pool;
    const persons = participants.map((id) => ({
      ...idMap.get(id),
      result: new Array(participants.length).fill(null),
    }));
    const reducedMap = new Map(persons.map(({ id }, index) => [id, index]));

    rounds.forEach(({ l, r, lp, rp }) => {
      const li = reducedMap.get(l);
      const ri = reducedMap.get(r);
      const leftPerson = persons[li];
      const rightPerson = persons[ri];

      leftPerson.result[ri] = { win: lp > rp, point: lp };
      rightPerson.result[li] = { win: lp < rp, point: rp };
    });

    return persons;
  }, [pool, idMap]);

  return (
    <div
      className={style.Grid}
      style={{
        gridTemplateColumns: `1fr 2fr repeat(${grid.length}, 1fr)`,
      }}
    >
      <div className={style.legend}>#</div>
      <div className={style.legend}>이름</div>
      {grid.map(({ id }, index) => (
        <div key={id} className={style.legend}>
          {index + 1}
        </div>
      ))}
      {grid.map(({ id, firstName, result }, p1) => (
        <Fragment key={id}>
          <div className={style.legend}>{p1 + 1}</div>
          <LinkButton size="sm" to={`/${branch}/person/${id}`} cn={style.name}>
            {firstName}
          </LinkButton>
          {result.map((res, p2) => {
            const key = `${p1}-${p2}`;
            if (p1 === p2) {
              return <div key={key} className={style.black} />;
            }
            if (res === null) {
              return <div key={key} />;
            }
            const { point, win } = res;
            return (
              <div key={key} className={win ? style.win : ''}>
                {point}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

export default function Pools({ pools, idMap }) {
  return (
    <div className={style.Pools}>
      {pools.map((pool) => (
        <Fragment key={pool.index}>
          <div className={style.label}>{`뿔 ${pool.index + 1}`}</div>
          <Grid pool={pool} idMap={idMap} />
        </Fragment>
      ))}
    </div>
  );
}
