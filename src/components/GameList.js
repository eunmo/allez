import { useEffect, useState } from 'react';

import { get, toPersonIdMap } from '../utils';
import IndividualGameGrid from './IndividualGameGrid';
import IndividualGames from './IndividualGames';
import ResponsiveTabs from './ResponsiveTabs';
import TeamGames from './TeamGames';

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
        <IndividualGameGrid games={games} idMap={idMap} allowEmpty={today} />
        <TeamGames games={games} idMap={idMap} />
      </div>
      <div>
        <IndividualGames games={games} idMap={idMap} />
      </div>
    </ResponsiveTabs>
  );
}
