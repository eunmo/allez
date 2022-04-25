import { useMemo } from 'react';

import { groupByPersonTypeName } from '../utils';
import style from './PersonSelect.module.css';

export default function PersonSelect({ persons, onClick, cn, alignRight }) {
  const [sections, widthSum] = useMemo(() => {
    const grouped = groupByPersonTypeName(persons);
    const widths = grouped.map(({ persons: ps }) => (ps.length > 6 ? 2 : 1));
    const sum = widths.reduce((a, b) => a + b, 0);
    const cumSum = [1];
    if (alignRight && sum < 3) {
      cumSum[0] = 4 - sum;
    }
    widths.forEach((width, index) => cumSum.push(cumSum[index] + width));
    const fullSections = grouped.map((section, i) => {
      const st = { gridColumn: `${cumSum[i]} / ${cumSum[i + 1]}` };
      const cname = widths[i] === 2 ? style.wideColumn : '';
      return { ...section, st, cname };
    });
    return [fullSections, Math.max(sum, 3)];
  }, [persons, alignRight]);

  return (
    <div
      className={`${style.PersonSelect} ${cn}`}
      style={{ gridTemplateColumns: `repeat(${widthSum}, 1fr` }}
    >
      {sections.map(({ name, persons: personsInSection, st, cname }) => (
        <div key={name} className={cname} style={st}>
          <label className={style.label}>{name}</label>
          {personsInSection.map(({ firstName, id }) => (
            <input
              type="button"
              key={id}
              value={firstName}
              onClick={() => onClick(id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
