import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { get, toPersonIdMap, formatDate } from './utils';
import { LinkButton } from './components';
import style from './ViewIndividualGame.module.css';

export default function ViewTeamGame() {
  const [game, setGame] = useState();
  const [idMap, setIdMap] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/id/${id}`, setGame);
  }, [id]);

  useEffect(() => {
    get('/api/person/list', (data) => setIdMap(toPersonIdMap(data)));
  }, []);

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
          to={`/game/date/${game.time.substring(0, 10)}`}
        >
          {formatDate(game.time)}
        </LinkButton>
        {` 개인전`}
      </div>
      <LinkButton size="sm" to={`/person/${l}`} cn={style.person}>
        {idMap.get(l).firstName}
      </LinkButton>
      <div className={lp >= rp ? 'highlight' : ''}>{lp}</div>
      <div className={lp <= rp ? 'highlight' : ''}>{rp}</div>
      <LinkButton size="sm" to={`/person/${r}`} cn={style.person}>
        {idMap.get(r).firstName}
      </LinkButton>
    </div>
  );
}
