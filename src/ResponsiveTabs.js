import { Children, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import style from './ResponsiveTabs.module.css';

function ResponsiveTabsSmall({ tabNames, children }) {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(0);
  }, [tabNames, children]);

  const child = Children.toArray(children)[tabIndex];
  const gridStyle = { gridTemplateColumns: `repeat(${tabNames.length}, 1fr)` };

  return (
    <div className={style.ResponsiveTabsSmall}>
      <div className={style.tabs} style={gridStyle}>
        {tabNames.map((tab, index) => (
          <button
            type="button"
            onClick={() => setTabIndex(index)}
            className={
              index === tabIndex ? style.selectedTab : style.notSelectedTab
            }
          >
            {tab}
          </button>
        ))}
      </div>
      {child}
    </div>
  );
}

function ResponsiveTabsLarge({ groups, widths, children }) {
  const childrenGroups = new Array(groups.length);
  let sum = 0;
  const childArray = Children.toArray(children);
  groups.forEach((group, index) => {
    childrenGroups[index] = { child: childArray.slice(sum, sum + group), index };
    sum += group;
  });

  const gridStyle = {
    gridTemplateColumns: widths.map((width) => `${width}fr`).join(' '),
  };

  return (
    <div className={style.ResponsiveTabsLarge} style={gridStyle}>
      {childrenGroups.map(({ child, index }) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
}

export default function ResponsiveTabs({ tabNames, groups, sizes, children }) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const filtered = children.filter((child) => child !== undefined);
  const widths = sizes ?? groups.map(() => 1);
  return isTabletOrMobile ? (
    <ResponsiveTabsSmall tabNames={tabNames}>{filtered}</ResponsiveTabsSmall>
  ) : (
    <ResponsiveTabsLarge groups={groups} widths={widths}>
      {filtered}
    </ResponsiveTabsLarge>
  );
}
