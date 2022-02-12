import { Fragment, useEffect, useState } from 'react';

import { get, toPersonIdMap } from '../utils';
import GameGrid from './GameGrid';
import LinkButton from './LinkButton';
import ResponsiveTabs from './ResponsiveTabs';
import Score from './Score';
import TeamGames from './TeamGames';
import style from './GameList.module.css';

export default function GameList({ games, children, today = false }) {
  const [idMap, setIdMap] = useState(null);

  useEffect(() => {
    get('/api/person/list', (data) => setIdMap(toPersonIdMap(data)));
  }, []);

  if (games === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  const tabNames = ['종합', '상세'];
  const groups = [1, 1];

  if (children) {
    tabNames.unshift('메뉴');
    groups[0] += 1;
  }

  return (
    <ResponsiveTabs tabNames={tabNames} groups={groups}>
      {children && <div>{children}</div>}
      <div>
        <GameGrid games={games} idMap={idMap} allowEmpty={today} />
        <TeamGames games={games} idMap={idMap} />
      </div>
      <div className={style.list}>
        {games.map(({ id, rounds }, index) =>
          rounds.map(({ l, r, lp, rp }) => (
            <Fragment key={`${id}-${l}-${r}`}>
              <div className="light-text">{games.length - index}</div>
              <div className={lp > rp ? 'highlight' : ''}>
                {idMap.get(l).firstName}
              </div>
              <Score scores={[lp, rp]} />
              <Score scores={[rp, lp]} />
              <div className={lp < rp ? 'highlight' : ''}>
                {idMap.get(r).firstName}
              </div>
              <LinkButton
                size="sm"
                to={`/game/individual/edit/${id}`}
                style={{ borderRadius: '20px' }}
              >
                <b>︙</b>
              </LinkButton>
            </Fragment>
          ))
        )}
      </div>
    </ResponsiveTabs>
  );
}
