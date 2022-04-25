import { useMemo } from 'react';

import { toPersonIdMap, ignoreType } from '../utils';
import IndividualGameGrid from './IndividualGameGrid';
import IndividualGameRank from './IndividualGameRank';
import Games from './Games';
import ResponsiveTabs from './ResponsiveTabs';

export default function GameList({ games, persons, children, today = false }) {
  const idMap = useMemo(() => toPersonIdMap(persons ?? []), [persons]);
  const wideView = useMemo(
    () => (persons ?? []).filter(({ type }) => !ignoreType(type)).length >= 10,
    [persons]
  );

  if (games === undefined || persons === undefined) {
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

  if (wideView) {
    if (children) {
      gridStyle.gridTemplateAreas = `'d d' 'a a' 'b c'`;
    } else {
      gridStyle.gridTemplateAreas = `'a a' 'b c'`;
    }
  }

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
      <Games
        games={games}
        idMap={idMap}
        editable={today}
        singleColumn={wideView}
      />
    </ResponsiveTabs>
  );
}
