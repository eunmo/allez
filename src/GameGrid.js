import { Fragment, useMemo } from 'react';

import style from './GameGrid.module.css';

export default function GameGrid({ games, personIdMap }) {
  const grid = useMemo(() => {
    const personIds = [
      ...new Set(
        games.flatMap(({ rounds }) => {
          const [{ l, r }] = rounds;
          return [l, r];
        })
      ),
    ].filter((id) => personIdMap.get(id).type !== 'c');

    const persons = personIds
      .map((id) => ({
        ...personIdMap.get(id),
        result: new Array(personIds.length).fill(null),
      }))
      .sort((p1, p2) => (p1.firstName < p2.firstName ? -1 : 1));

    const reducedMap = new Map(
      persons.map((person, index) => [person.id, index])
    );

    [...games].reverse().forEach(({ rounds }) => {
      const [{ l, r, lp, rp }] = rounds;
      if (reducedMap.has(l) && reducedMap.has(r)) {
        const li = reducedMap.get(l);
        const ri = reducedMap.get(r);
        const leftPerson = persons[li];
        const rightPerson = persons[ri];

        if (leftPerson.result[ri] === null) {
          leftPerson.result[ri] = { win: lp > rp, point: lp };
          rightPerson.result[li] = { win: lp < rp, point: rp };
        }
      }
    });

    return persons;
  }, [games, personIdMap]);

  return (
    <div
      className={style.GameGrid}
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
          <div>{firstName}</div>
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
