import { Fragment, useMemo } from 'react';

import { sortByName, ignoreType } from '../utils';
import LinkButton from './LinkButton';
import style from './IndividualGameGrid.module.css';

export default function GameGrid({ games, idMap, allowEmpty = false }) {
  const grid = useMemo(() => {
    function isCoach(id) {
      return ignoreType(idMap.get(id).type);
    }

    const individualGames = games.filter(({ type }) => type === 1);

    const personIds =
      allowEmpty && individualGames.length > 0
        ? [...idMap.values()]
            .filter(({ type, today }) => today && !ignoreType(type))
            .map(({ id }) => id)
        : [
            ...new Set(
              individualGames.flatMap(({ rounds }) => {
                const [{ l, r }] = rounds;
                return isCoach(l) || isCoach(r) ? [] : [l, r];
              })
            ),
          ];

    const persons = personIds
      .map((id) => ({
        ...idMap.get(id),
        result: new Array(personIds.length).fill(null),
      }))
      .sort(sortByName);

    const reducedMap = new Map(
      persons.map((person, index) => [person.id, index])
    );

    [...individualGames].reverse().forEach(({ rounds }) => {
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
  }, [games, idMap, allowEmpty]);

  if (grid.length === 0) {
    return null;
  }

  return (
    <div className={style.GameGrid}>
      <div
        className={style.pool}
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
            <LinkButton size="sm" to={`/person/${id}`} cn={style.name}>
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
    </div>
  );
}
