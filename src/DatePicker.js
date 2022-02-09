import { useEffect, useState } from 'react';

import LinkButton from './LinkButton';
import { get } from './utils';
import style from './DatePicker.module.css';

function extractYMD(dateString) {
  return dateString
    .substring(0, 10)
    .split('-')
    .map((d) => parseInt(d, 10));
}

function getDates(y, m) {
  const firstDay = new Date(y, m - 1, 1).getDay();
  const endDate = new Date(y, m, 0).getDate();

  return {
    offset: firstDay,
    dates: [...new Array(endDate).keys()].map((d) => d + 1),
  };
}

function getMonths(dates) {
  const ret = [];
  let cur;
  dates.forEach(({ date }) => {
    const [y, m, d] = extractYMD(date);

    if (cur === undefined || cur.y !== y || cur.m !== m) {
      if (cur !== undefined) {
        ret.push(cur);
      }
      cur = { y, m, ...getDates(y, m), active: new Set() };
    }

    cur.active.add(d);
  });
  ret.push(cur);

  return ret;
}

function toYMD(y, m, d) {
  return new Date(Date.UTC(y, m - 1, d)).toISOString().substring(0, 10);
}

export default function DatePicker() {
  const [months, setMonths] = useState();
  const [monthIndex, setMonthIndex] = useState();

  useEffect(() => {
    get('/api/game/dates', (dates) => {
      setMonths(getMonths(dates));
      setMonthIndex(0);
    });
  }, []);

  if (months === undefined || monthIndex === undefined) {
    return null; // TODO: spinner
  }

  const month = months[monthIndex];
  const { y, m, dates, offset, active } = month;
  // const hasPrev = monthIndex > 0;
  // const hasNext = monthIndex < months.length - 1;

  return (
    <div className={style.DatePicker}>
      <div className="header">
        {y}년 {m}월
      </div>
      <div className={style.grid}>
        {dates.map((date) => {
          const isActive = active.has(date);
          const divStyle = {};
          if (date === 1 && offset > 0) {
            divStyle.gridColumnStart = offset + 1;
          }

          return (
            <div
              key={date}
              className={isActive ? '' : style.inactive}
              style={divStyle}
            >
              {isActive ? (
                <LinkButton size="sm" to={`/game/date/${toYMD(y, m, date)}`}>
                  {date}
                </LinkButton>
              ) : (
                date
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
