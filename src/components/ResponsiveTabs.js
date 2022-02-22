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
            key={tab}
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

function ResponsiveTabsLarge({ grid, tabNames, areas, givenStyle, children }) {
  const childArray = Children.toArray(children);
  const gridSize = grid ?? childArray.length;

  const gridStyle = givenStyle ?? {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  };

  return (
    <div className={style.ResponsiveTabsLarge} style={gridStyle}>
      {childArray.map((child, index) => (
        <div key={tabNames[index]} style={{ gridArea: areas?.[index] }}>
          {child}
        </div>
      ))}
    </div>
  );
}

export default function ResponsiveTabs({
  tabNames,
  grid,
  givenStyle,
  areas,
  children,
}) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' });
  return isTabletOrMobile ? (
    <ResponsiveTabsSmall tabNames={tabNames}>{children}</ResponsiveTabsSmall>
  ) : (
    <ResponsiveTabsLarge
      grid={grid}
      tabNames={tabNames}
      areas={areas}
      givenStyle={givenStyle}
    >
      {children}
    </ResponsiveTabsLarge>
  );
}
