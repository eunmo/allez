import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LinkButton } from './components';
import { useBranch } from './BranchContext';
import { get, toPersonIdMap, formatDate } from './utils';
import style from './ViewTeamGame.module.css';

const gameTypes = {
  2: '2:2',
  3: '3:3',
  4: '4:4',
};

function displayGameType(type) {
  return gameTypes[type] ?? '';
}

export default function ViewTeamGame() {
  const [game, setGame] = useState();
  const [idMap, setIdMap] = useState(null);
  const { id } = useParams();
  const { branch } = useBranch();

  useEffect(() => {
    get(`/api/game/id/${id}`, (data) => {
      setGame(data.game);
      setIdMap(toPersonIdMap(data.persons));
    });
  }, [id]);

  const calculated = useMemo(
    () =>
      game?.rounds.map((round, index) => {
        const prev = game.rounds[index - 1] ?? { lp: '0', rp: '0' };
        const [ld, rd] = ['lp', 'rp'].map((key) => round[key] - prev[key]);
        return { ...round, ld, rd };
      }),
    [game]
  );

  if (game === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.ViewTeamGame}>
      <div className={`header ${style.header}`}>
        <LinkButton
          size="sm"
          cn={style.date}
          to={`/${branch}/game/date/${game.time.substring(0, 10)}`}
        >
          {formatDate(game.time)}
        </LinkButton>
        {` ${displayGameType(game.type)} 단체전`}
      </div>
      <div className="light-text">선수</div>
      <div className="light-text">누계</div>
      <div className="light-text">소계</div>
      <div className="light-text">득점</div>
      <div className="light-text">소계</div>
      <div className="light-text">누계</div>
      <div className="light-text">선수</div>
      {calculated.map(({ l, r, lp, rp, ld, rd }, index) => (
        <Fragment
          /* eslint-disable-next-line react/no-array-index-key */
          key={index}
        >
          <LinkButton size="sm" to={`/${branch}/person/${l}`} cn={style.person}>
            {idMap.get(l).firstName}
          </LinkButton>
          <div className="light-text">{ld}</div>
          <div className={lp >= rp ? 'highlight' : ''}>{lp}</div>
          <div className="light-text">{index * 5 + 5}</div>
          <div className={lp <= rp ? 'highlight' : ''}>{rp}</div>
          <div className="light-text">{rd}</div>
          <LinkButton size="sm" to={`/${branch}/person/${r}`} cn={style.person}>
            {idMap.get(r).firstName}
          </LinkButton>
        </Fragment>
      ))}
    </div>
  );
}
