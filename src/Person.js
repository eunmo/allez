import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LinkButton, ResponsiveTabs } from './components';
import { useBranch } from './BranchContext';
import { View } from './svg';
import { get, toPersonIdMap, branchCodes } from './utils';
import style from './Person.module.css';

function calc({ count, wins }) {
  return Math.floor((wins / count) * 100);
}

function pad(number) {
  return `${number}`.padStart(3, '\xa0');
}

function Result({ result: { count, wins, ratio } }) {
  if (count === 0) {
    return <div />;
  }
  return (
    <div className={`${style.result} mono`}>
      {pad(ratio)}%{pad(count)}전{pad(wins)}승
    </div>
  );
}

function ResultByDate({ byDate }) {
  const calculated = useMemo(
    () => byDate.map((date) => ({ ...date, ratio: calc(date) })),
    [byDate]
  );

  return (
    <div className={style.byDate}>
      <div className="highlight">날짜</div>
      <div className="highlight">전적</div>
      {calculated.map(({ date, branch, ...result }) => (
        <Fragment key={date}>
          <LinkButton
            size="sm"
            cn="mono"
            to={`/${branchCodes[branch]}/game/date/${date}`}
          >
            {date.substring(5, 10)}
          </LinkButton>
          <Result result={result} />
        </Fragment>
      ))}
    </div>
  );
}

function OpponentRow({ result, id }) {
  const { branch } = useBranch();
  return (
    <>
      <LinkButton size="sm" to={`/${branch}/person/${result.vs}`}>
        {result.name}
      </LinkButton>
      <Result result={result} />
      <LinkButton
        size="sm"
        to={`/${branch}/game/duo/${id}/${result.vs}`}
        style={{ borderRadius: '20px' }}
      >
        <View />
      </LinkButton>
    </>
  );
}

function ResultByOpponent({ byPerson, idMap, id }) {
  const calculated = useMemo(
    () =>
      Object.entries(byPerson)
        .map(([key, opponent]) => ({ ...opponent, vs: parseInt(key, 10) }))
        .map((opponent) => ({
          ...opponent,
          name: idMap.get(opponent.vs).firstName,
          ratio: calc(opponent),
        }))
        .sort((p1, p2) => {
          if (p1.ratio !== p2.ratio) {
            return p2.ratio - p1.ratio;
          }

          return p1.name < p2.name ? -1 : 1;
        }),
    [byPerson, idMap]
  );

  const [recents, rest] = useMemo(() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const reference = lastMonth.toISOString().substring(0, 10);

    return [
      calculated.filter(({ latest }) => latest > reference),
      calculated.filter(({ latest }) => latest <= reference),
    ];
  }, [calculated]);

  return (
    <div className={style.byPerson}>
      <div className="highlight">상대</div>
      <div className="highlight">전적</div>
      <div />
      {recents.length > 0 && rest.length > 0 && (
        <div className={style.legend}>최근</div>
      )}
      {recents.map((result) => (
        <OpponentRow key={result.vs} id={id} result={result} />
      ))}
      {recents.length > 0 && rest.length > 0 && (
        <div className={style.legend}>옛날</div>
      )}
      {rest.map((result) => (
        <OpponentRow key={result.vs} id={id} result={result} />
      ))}
    </div>
  );
}

function PersonLoaded({ idMap, byPerson, byDate, id }) {
  const { firstName, lastName } = idMap.get(id);

  return (
    <div className={style.Person}>
      <div className="header">
        {lastName}
        {firstName} 전적
      </div>
      <ResponsiveTabs tabNames={['상대별', '날짜별']}>
        <ResultByOpponent byPerson={byPerson} idMap={idMap} id={id} />
        <ResultByDate byDate={byDate} />
      </ResponsiveTabs>
    </div>
  );
}

export default function Person() {
  const [idMap, setIdMap] = useState(null);
  const [byDate, setByDate] = useState();
  const [byPerson, setByPerson] = useState();
  const { id } = useParams();

  useEffect(() => {
    get(
      `/api/person/summary/${id}`,
      ({ persons, byDate: date, byPerson: person }) => {
        setIdMap(toPersonIdMap(persons));
        setByDate(date);
        setByPerson(person);
      }
    );
  }, [id]);

  if (idMap === null || byPerson === undefined || byDate === undefined) {
    return null; // TODO: spinner
  }

  return (
    <PersonLoaded
      idMap={idMap}
      byDate={byDate}
      byPerson={byPerson}
      id={parseInt(id, 10)}
    />
  );
}
