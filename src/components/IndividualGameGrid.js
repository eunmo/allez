import { Fragment, useMemo } from 'react';

import LinkButton from './LinkButton';
import style from './IndividualGameGrid.module.css';

const emptyRank = { victories: 0, matches: 0, scored: 0, received: 0 };

function calc({ victories, matches, scored, received }) {
  const ratio = matches > 0 ? Math.floor((victories / matches) * 100) : 0;
  const diff = scored - received;
  return { ratio, diff };
}

function sortByName(p1, p2) {
  return p1.firstName < p2.firstName ? -1 : 1;
}

function sortByStat(p1, p2) {
  if (p1.ratio !== p2.ratio) {
    return p2.ratio - p1.ratio;
  }

  if (p1.diff !== p2.diff) {
    return p2.diff - p1.diff;
  }

  if (p1.scored !== p2.scored) {
    return p2.scored - p1.scored;
  }

  return 0;
}

export default function GameGrid({ games, idMap, allowEmpty = false }) {
  const [grid, ranking] = useMemo(() => {
    function isCoach(id) {
      return idMap.get(id).type === 'c';
    }

    const individualGames = games.filter(({ type }) => type === 1);

    const personIds =
      allowEmpty && individualGames.length > 0
        ? [...idMap.values()]
            .filter(({ type, today }) => today && type !== 'c')
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
        ...emptyRank,
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

          leftPerson.matches += 1;
          rightPerson.matches += 1;
          leftPerson.scored += lp;
          rightPerson.scored += rp;
          leftPerson.received += rp;
          rightPerson.received += lp;

          if (lp > rp) {
            leftPerson.victories += 1;
          } else if (lp < rp) {
            rightPerson.victories += 1;
          }
        }
      }
    });

    const calculated = persons.map((person) => ({
      ...person,
      ...calc(person),
    }));
    const ranked = [...calculated].sort((p1, p2) => {
      const statDifference = sortByStat(p1, p2);

      if (statDifference !== 0) {
        return statDifference;
      }

      return sortByName(p1, p2);
    });

    let prevRank = 1;
    const finalRanked = ranked.map((person, index) => {
      let rank = index + 1;
      if (index === 0) {
        return { ...person, rank };
      }

      const prev = ranked[index - 1];
      if (sortByStat(prev, person) === 0) {
        rank = prevRank;
      } else {
        prevRank = rank;
      }

      return { ...person, rank };
    });

    return [persons, finalRanked];
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
      <div className={style.ranking}>
        <div className={style.legend}>순위</div>
        <div className={style.legend}>이름</div>
        <div className={style.legend}>승률</div>
        <div className={style.legend}>득실</div>
        <div className={style.legend}>득점</div>
        {ranking.map(({ id, firstName, rank, ratio, diff, scored }) => (
          <Fragment key={id}>
            <div>{rank}</div>
            <LinkButton size="sm" to={`/person/${id}`}>
              {firstName}
            </LinkButton>
            <div>{ratio}</div>
            <div>{diff}</div>
            <div>{scored}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
