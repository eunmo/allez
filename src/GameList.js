import { Fragment, useEffect, useState } from 'react';

import GameGrid from './GameGrid';
import LinkButton from './LinkButton';
import ResponsiveTab from './ResponsiveTab';
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

  const tabNames = ['종합', '상세'];
  const groups = [1, 1];

  if (children) {
    tabNames.unshift('메뉴');
    groups[0] += 1;
  }

  return (
    <ResponsiveTab tabNames={tabNames} groups={groups}>
      {children}
      <GameGrid games={games} personIdMap={personIdMap} allowEmpty={today} />
      <div className={style.list}>
        {games.map(({ id, rounds }, index) =>
          rounds.map(({ l, r, lp, rp }) => (
            <Fragment key={`${id}-${l}-${r}`}>
              <div className={style.index}>{games.length - index}</div>
              <div className={lp > rp ? style.winner : ''}>
                {personIdMap.get(l).firstName}
              </div>
              <div className={lp > rp ? '' : style.loserScore}>{lp}</div>
              <div className={lp < rp ? '' : style.loserScore}>{rp}</div>
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
    </ResponsiveTab>
  );
}
