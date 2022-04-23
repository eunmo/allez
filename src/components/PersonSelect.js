import { useMemo } from 'react';

import { groupByPersonTypeName } from '../utils';
import style from './PersonSelect.module.css';

export default function PersonSelect({ persons, onClick, cn, alignRight }) {
  const sections = useMemo(() => groupByPersonTypeName(persons), [persons]);

  const firstStyle = {};
  if (alignRight && sections.length < 3) {
    firstStyle.gridColumnStart = 4 - sections.length;
  }

  return (
    <div className={`${style.PersonSelect} ${cn}`}>
      {sections.map(({ name, persons: personsInSection }, index) => (
        <div key={name} style={index === 0 ? firstStyle : {}}>
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
