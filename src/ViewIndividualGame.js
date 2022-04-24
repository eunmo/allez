import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LinkButton } from './components';
import { useBranch } from './BranchContext';
import style from './ViewIndividualGame.module.css';
import { get, toPersonIdMap, formatDate } from './utils';

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

  if (game === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  const [{ l, r, lp, rp }] = game.rounds;

  return (
    <div className={style.ViewIndividualGame}>
      <div className={`header ${style.header}`}>
        <LinkButton
          size="sm"
          cn={style.date}
          to={`/${branch}/game/date/${game.time.substring(0, 10)}`}
        >
          {formatDate(game.time)}
        </LinkButton>
        {` 개인전`}
      </div>
      <LinkButton size="sm" to={`/${branch}/person/${l}`} cn={style.person}>
        {idMap.get(l).firstName}
      </LinkButton>
      <div className={lp >= rp ? 'highlight' : ''}>{lp}</div>
      <div className={lp <= rp ? 'highlight' : ''}>{rp}</div>
      <LinkButton size="sm" to={`/${branch}/person/${r}`} cn={style.person}>
        {idMap.get(r).firstName}
      </LinkButton>
      <div className={style.header}>
        <LinkButton size="sm" to={`/${branch}/game/duo/${l}/${r}`}>
          전적 보기
        </LinkButton>
      </div>
    </div>
  );
}
