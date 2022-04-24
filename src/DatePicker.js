import { useEffect, useState } from 'react';

import { LinkButton } from './components';
import { useBranch } from './BranchContext';
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

function newMonth(y, m) {
  return { y, m, ...getDates(y, m), active: new Set() };
}

function getMonths(dates) {
  const ret = [];
  const [nowY, nowM] = extractYMD(new Date().toISOString());
  let cur = newMonth(nowY, nowM);
  dates.forEach(({ date }) => {
    const [y, m, d] = extractYMD(date);

    if (cur === undefined || cur.y !== y || cur.m !== m) {
      if (cur !== undefined) {
        ret.push(cur);
      }
      cur = newMonth(y, m);
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
  const { branch, branchId } = useBranch();

  useEffect(() => {
    get(`/api/game/dates/${branchId}`, (dates) => {
      setMonths(getMonths(dates));
      setMonthIndex(0);
    });
  }, [branchId]);

  if (months === undefined || monthIndex === undefined) {
    return null; // TODO: spinner
  }

  const month = months[monthIndex];
  const { y, m, dates, offset, active } = month;
  const hasNext = monthIndex > 0;
  const hasPrev = monthIndex < months.length - 1;

  return (
    <div className={style.DatePicker}>
      <div className={`${style.header} header`}>
        <button
          type="button"
          onClick={() => setMonthIndex(monthIndex + 1)}
          disabled={!hasPrev}
        >
          {((m + 10) % 12) + 1}월
        </button>
        <div>
          {y % 100}년 {m}월
        </div>
        <button
          type="button"
          onClick={() => setMonthIndex(monthIndex - 1)}
          disabled={!hasNext}
        >
          {(m % 12) + 1}월
        </button>
      </div>
      <div className={style.grid}>
        <div className={style.legend}>S</div>
        <div className={style.legend}>M</div>
        <div className={style.legend}>T</div>
        <div className={style.legend}>W</div>
        <div className={style.legend}>T</div>
        <div className={style.legend}>F</div>
        <div className={style.legend}>S</div>
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
                <LinkButton
                  size="sm"
                  to={`/${branch}/game/date/${toYMD(y, m, date)}`}
                >
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
