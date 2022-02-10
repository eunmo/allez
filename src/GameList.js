import { Fragment, useEffect, useState } from 'react';

import GameGrid from './GameGrid';
import LinkButton from './LinkButton';
import { get, toPersonIdMap } from './utils';
import style from './GameList.module.css';

export default function GameList({ games, children, today = false }) {
  const [personIdMap, setPersonIdMap] = useState(null);

  useEffect(() => {
    get('/api/person/list', (data) => setPersonIdMap(toPersonIdMap(data)));
  }, []);

  if (games === undefined || personIdMap === null) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.GameList}>
      <div>
        {children}
        <GameGrid games={games} personIdMap={personIdMap} allowEmpty={today} />
        <hr className={style.divider} />
      </div>
      <div className={style.list}>
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
              <LinkButton
                size="sm"
                to={`/game/edit/${id}`}
                style={{ borderRadius: '20px' }}
              >
                <b>︙</b>
              </LinkButton>
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
