import { Fragment, useMemo } from 'react';

import { useBranch } from '../BranchContext';
import { sortByName, ignoreType, calc, sortByStat } from '../utils';
import LinkButton from './LinkButton';
import Stat from './Stat';
import style from './IndividualGameRank.module.css';

const emptyRank = { victories: 0, matches: 0, scored: 0, received: 0 };

export default function GameRank({ games, idMap, allowEmpty = false }) {
  const { branch } = useBranch();

  const ranking = useMemo(() => {
    function isCoach(id) {
      return ignoreType(idMap.get(id).type);
    }

    const individualGames = games.filter(({ type }) => type === 1);

    const personIds =
      allowEmpty && individualGames.length > 0
        ? [...idMap.values()]
            .filter(({ type }) => !ignoreType(type))
            .map(({ id }) => id)
        : [
            ...new Set(
              individualGames.flatMap(({ rounds }) => {
                const [{ l, r }] = rounds;
                return isCoach(l) || isCoach(r) ? [] : [l, r];
              })
            ),
          ];

    const persons = personIds.map((id) => ({
      ...idMap.get(id),
      ...emptyRank,
      met: new Set(),
    }));

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

        if (!leftPerson.met.has(ri)) {
          leftPerson.met.add(ri);
          rightPerson.met.add(li);

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

    return finalRanked;
  }, [games, idMap, allowEmpty]);

  if (ranking.length === 0) {
    return null;
  }

  return (
    <div className={style.ranking}>
      <div className={style.legend}>순위</div>
      <div className={style.legend}>이름</div>
      <div className={style.legend}>승률</div>
      <div className={style.legend}>득실</div>
      <div className={style.legend}>득점</div>
      {ranking.map(({ id, firstName, rank, ratio, diff, scored }) => (
        <Fragment key={id}>
          <div className={style.rank}>{rank}</div>
          <LinkButton size="sm" to={`/${branch}/person/${id}`} cn={style.name}>
            {firstName}
          </LinkButton>
          <Stat value={ratio} />
          <Stat value={diff} />
          <Stat value={scored} />
        </Fragment>
      ))}
    </div>
  );
}
