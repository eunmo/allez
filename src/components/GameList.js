import { useEffect, useState } from 'react';

import { get, toPersonIdMap } from '../utils';
import IndividualGameGrid from './IndividualGameGrid';
import IndividualGameRank from './IndividualGameRank';
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

  const tabNames = ['종합', '순위', '상세'];
  const gridStyle = {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'auto',
    gridGap: '16px',
    gridTemplateAreas: `'a a b b' '. c c .'`,
  };
  const areas = ['a', 'b', 'c'];

  if (children) {
    tabNames.unshift('메뉴');
    gridStyle.gridTemplateAreas = `'d d d d' 'a a b b' '. c c .'`;
    areas.unshift('d');
  }

  return (
    <ResponsiveTabs tabNames={tabNames} givenStyle={gridStyle} areas={areas}>
      {children && <div>{children}</div>}
      <div>
        <IndividualGameGrid games={games} idMap={idMap} allowEmpty={today} />
        <TeamGames games={games} idMap={idMap} />
      </div>
      <div>
        <IndividualGameRank games={games} idMap={idMap} allowEmpty={today} />
      </div>
      <div>
        <IndividualGames games={games} idMap={idMap} />
      </div>
    </ResponsiveTabs>
  );
}
