import { useCallback, useMemo } from 'react';

import { groupByPersonTypeName } from '../utils';
import style from './ChooseFreeTeamMembers.module.css';

export default function ChooseFreeTeamMembers({
  side,
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

  const done = list.length > 0;

  return (
    <form className={style.ChooseFreeTeamMembers}>
      <div className={style.header}>팀 {side + 1} 인원 선택</div>
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
