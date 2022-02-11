import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import style from './ResponsiveTab.module.css';

function ResponsiveTabSmall({ tabNames, children }) {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(0);
  }, [tabNames, children]);

  const child = children[tabIndex];
  const gridStyle = { gridTemplateColumns: `repeat(${tabNames.length}, 1fr)` };

  return (
    <div className={style.ResponsiveTabsSmall}>
      <div className={style.tabs} style={gridStyle}>
        {tabNames.map((tab, index) => (
          <button onClick={() => setTabIndex(index)} className={index === tabIndex ? style.selectedTab : style.notSelectedTab}>
            {tab}
          </button>
        ))}
      </div>
      {child}
    </div>
  );
}

function ResponsiveTabLarge({ groups, children }) {
  const childrenGroups = new Array(groups.length);
  let sum = 0;
  groups.forEach((group, index) => {
    childrenGroups[index] = { child: children.slice(sum, sum + group), index };
    sum += group;
  });

  const gridStyle = { gridTemplateColumns: `repeat(${groups.length}, 1fr)` };

  return (
    <div className={style.ResponsiveTabLarge} style={gridStyle}>
      {childrenGroups.map(({ child, index }) => (
        <div key={index}>
          {child}
        </div>
      ))}
    </div>
  );
}

export default function ResponsiveTab({ tabNames, groups, children }) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const filtered = children.filter((child) => child !== undefined);
  return isTabletOrMobile ? (
    <ResponsiveTabSmall tabNames={tabNames}>{filtered}</ResponsiveTabSmall>
  ) : (
    <ResponsiveTabLarge groups={groups}>{filtered}</ResponsiveTabLarge>
  );
}
