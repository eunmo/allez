import { useEffect, useState } from 'react';

import { get, toPersonIdMap } from '../utils';
import IndividualGameGrid from './IndividualGameGrid';
import IndividualGameRank from './IndividualGameRank';
import Games from './Games';
import ResponsiveTabs from './ResponsiveTabs';

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
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'auto',
    gridGap: '16px',
    gridTemplateAreas: `'a b' 'c c'`,
  };
  const areas = ['a', 'b', 'c'];

  if (children) {
    tabNames.unshift('메뉴');
    gridStyle.gridTemplateAreas = `'d d' 'a b' 'c c'`;
    areas.unshift('d');
  }

  return (
    <ResponsiveTabs tabNames={tabNames} givenStyle={gridStyle} areas={areas}>
      {children && <div>{children}</div>}
      <IndividualGameGrid games={games} idMap={idMap} allowEmpty={today} />
      <IndividualGameRank games={games} idMap={idMap} allowEmpty={today} />
      <Games games={games} idMap={idMap} />
    </ResponsiveTabs>
  );
}
