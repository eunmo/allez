import { Fragment, useEffect, useState } from 'react';

import LinkButton from './LinkButton';
import { get, toPersonIdMap } from './utils';
import style from './GameList.module.css';

export default function GameList({ games }) {
  const [personIdMap, setPersonIdMap] = useState(null);

  useEffect(() => {
    get('/api/person/list', (data) => setPersonIdMap(toPersonIdMap(data)));
  }, []);

  if (personIdMap === null) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.GameList}>
      {games.map(({ id, rounds }) =>
        rounds.map(({ l, r, lp, rp }) => (
          <Fragment key={`${id}-${l}-${r}`}>
            <div className={lp > rp ? style.winner : ''}>
              {personIdMap.get(l).firstName}
            </div>
            <div>{lp}</div>
            <div>{lp > rp && 'V'}</div>
            <div>{lp < rp && 'V'}</div>
            <div>{rp}</div>
            <div className={lp < rp ? style.winner : ''}>
              {personIdMap.get(r).firstName}
            </div>
            <LinkButton mb={0} to={`/game/edit/${id}`}>
              <b>︙</b>
            </LinkButton>
          </Fragment>
        ))
      )}
    </div>
  );
}
