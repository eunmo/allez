import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LinkButton } from './components';
import { useBranch } from './BranchContext';
import { get, toPersonIdMap, parseValue, branchCodes } from './utils';
import style from './Duo.module.css';

function describe(games, wins) {
  if (games.length === wins) {
    return '전승';
  }
  if (wins === 0) {
    return '전패';
  }

  const [{ lp: lp1, rp: rp1 }] = games;

  if (lp1 > rp1) {
    const streak = games.findIndex(({ lp, rp }) => lp <= rp);
    return `최근 ${streak}${streak > 1 ? '연' : ''}승`;
  }

  const streak = games.findIndex(({ lp, rp }) => lp > rp);
  return `최근 ${streak}${streak > 1 ? '연' : ''}패`;
}

export default function Duo() {
  const [games, setGames] = useState();
  const [idMap, setIdMap] = useState(null);
  const { l, r } = useParams();
  const { branch } = useBranch();

  useEffect(() => {
    get(`/api/game/history/${l}/${r}`, (data) => {
      setGames(data.games);
      setIdMap(toPersonIdMap(data.persons));
    });
  }, [l, r]);

  const lv = useMemo(() => parseValue(l), [l]);
  const rv = useMemo(() => parseValue(r), [r]);

  const individualGames = useMemo(
    () =>
      games
        ?.filter(({ type }) => type === 1)
        .map(({ id, branch: br, time, rounds }) => {
          const [{ r: gameR }] = rounds;
          let [{ lp, rp }] = rounds;

          if (gameR === lv) {
            [lp, rp] = [rp, lp];
          }

          return { id, br, time: time.substring(0, 10), lp, rp };
        }) ?? [],
    [games, lv]
  );

  const wins = useMemo(
    () => individualGames.filter(({ lp, rp }) => lp > rp).length,
    [individualGames]
  );

  const desc = useMemo(
    () => describe(individualGames, wins),
    [individualGames, wins]
  );

  if (games === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  const { firstName: lFirstName, lastName: lLastName } = idMap.get(lv);
  const { firstName: rFirstName, lastName: rLastName } = idMap.get(rv);

  return (
    <div className={style.Duo}>
      <div className={`header ${style.header}`}>
        <LinkButton size="sm" to={`/${branch}/person/${l}`} cn={style.name}>
          {lLastName}
          {lFirstName}
        </LinkButton>
        {' vs '}
        <LinkButton size="sm" to={`/${branch}/person/${r}`} cn={style.name}>
          {rLastName}
          {rFirstName}
        </LinkButton>
      </div>
      <div className={style.header}>
        {`${individualGames.length}경기 ${wins}승 ${desc}`}
      </div>
      {individualGames.map(({ id, br, time, lp, rp }) => (
        <Fragment key={id}>
          <LinkButton
            size="sm"
            cn="mono"
            to={`/${branchCodes[br]}/game/date/${time}`}
          >
            {time.substring(5, 10)}
          </LinkButton>
          <div>{lFirstName}</div>
          <div className={lp >= rp ? 'highlight' : ''}>{lp}</div>
          <div className={lp <= rp ? 'highlight' : ''}>{rp}</div>
          <div>{rFirstName}</div>
        </Fragment>
      ))}
      <div className={style.header}>
        <LinkButton size="sm" to={`/${branch}/game/duo/${r}/${l}`}>
          {`${rLastName}${rFirstName} vs ${lLastName}${lFirstName} 전적 보기`}
        </LinkButton>
      </div>
    </div>
  );
}
