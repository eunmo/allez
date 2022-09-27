import { useCallback, useMemo } from 'react';

import { groupByPersonTypeName } from '../utils';
import style from './ChooseParticipants.module.css';

export default function ChooseParticipants({
  list,
  setList,
  persons,
  nextValue,
  onDone,
}) {
  const sections = useMemo(() => groupByPersonTypeName(persons), [persons]);

  const onClick = useCallback(
    (id) => {
      if (list.includes(id)) {
        setList(list.filter((e) => e !== id));
      } else {
        setList([...list, id].sort());
      }
    },
    [list, setList]
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onDone(event);
    },
    [onDone]
  );

  const done = list.length >= 4;

  return (
    <form className={style.ChooseParticipants}>
      <div className={style.header}>참가 인원 선택</div>
      {sections.map(({ name, persons: personsInSection }) => (
        <div key={name}>
          <label className={style.label}>{name}</label>
          {personsInSection.map(({ firstName, id }) => (
            <input
              type="button"
              key={id}
              value={firstName}
              className={list.includes(id) ? style.selected : ''}
              onClick={() => onClick(id)}
            />
          ))}
        </div>
      ))}
      <input
        type="submit"
        value={nextValue}
        disabled={!done}
        onClick={onSubmit}
      />
    </form>
  );
}
