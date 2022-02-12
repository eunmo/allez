import { useMemo } from 'react';

import { displayPersonType, groupByPersonType } from '../utils';
import style from './PersonSelect.module.css';

export default function PersonSelect({ persons, onClick, cn }) {
  const sections = useMemo(() => groupByPersonType(persons), [persons]);

  return (
    <div className={`${style.PersonSelect} ${cn}`}>
      {sections.map(({ code, persons: personsInSection }) => (
        <div key={code}>
          <label className={style.label}>{displayPersonType(code)}</label>
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
