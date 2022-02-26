import { useMemo } from 'react';

import { groupByPersonTypeName } from '../utils';
import style from './PersonSelect.module.css';

export default function PersonSelect({ persons, onClick, cn }) {
  const sections = useMemo(() => groupByPersonTypeName(persons), [persons]);

  return (
    <div className={`${style.PersonSelect} ${cn}`}>
      {sections.map(({ name, persons: personsInSection }) => (
        <div key={name}>
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
