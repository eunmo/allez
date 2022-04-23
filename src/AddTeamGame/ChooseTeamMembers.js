import { Fragment, useCallback, useEffect, useState } from 'react';

import { PersonSelect } from '../components';
import style from './index.module.css';

function updateIndex(list, setList, index, newValue) {
  const newList = [...list];
  newList[index] = newValue;
  setList(newList);
}

function displaySize(size) {
  if (size === 0) {
    return '자유';
  }

  return `${size}:${size}`;
}

export default function ChooseTeamMembers({
  size,
  setSize,
  ls,
  setLs,
  rs,
  setRs,
  persons,
  idMap,
  nextValue,
  onDone,
}) {
  const [step, setStep] = useState(0);
  const [automatic, setAutomatic] = useState(false);

  useEffect(() => {
    setStep(0);
    setAutomatic(true);
  }, [size]);

  const selectPerson = useCallback(
    (id) => {
      if (step < size) {
        updateIndex(ls, setLs, step, id);
      } else {
        updateIndex(rs, setRs, step - size, id);
      }

      if (automatic && step + 1 < size * 2) {
        setStep(step + 1);
      } else {
        setStep(-1);
        setAutomatic(false);
      }
    },
    [step, size, ls, rs, setLs, setRs, automatic]
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onDone();
    },
    [onDone]
  );

  const done = ls.every((id) => id !== null) && rs.every((id) => id !== null);

  return (
    <form className={style.ChooseTeamMembers}>
      <label className={style.label}>인원</label>
      {[0, 2, 3, 4].map((n) => (
        <input
          type="button"
          key={n}
          value={displaySize(n)}
          onClick={() => setSize(n)}
          disabled={size === n}
        />
      ))}
      {size > 0 && (
        <>
          {[
            ['팀 1', ls],
            ['팀 2', rs],
          ].map(([teamName, list], teamIndex) => (
            <Fragment key={teamName}>
              <label className={style.label}>{teamName}</label>
              {list.map((id, index) => (
                <input
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={`${id}-${index}`}
                  type="button"
                  value={idMap.get(id)?.firstName ?? '선택'}
                  className={
                    teamIndex * size + index === step ? style.selected : ''
                  }
                  onClick={() => setStep(teamIndex * size + index)}
                />
              ))}
            </Fragment>
          ))}
          {step >= 0 && (
            <PersonSelect
              persons={persons}
              onClick={selectPerson}
              cn={style.personSelect}
            />
          )}
        </>
      )}
      <input
        type="submit"
        value={nextValue}
        disabled={!done}
        onClick={onSubmit}
      />
    </form>
  );
}
