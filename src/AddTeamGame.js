import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get, post, toPersonIdMap, gameOrder, buildRounds } from './utils';
import { PersonSelect } from './components';
import style from './AddTeamGame.module.css';

function updateIndex(list, setList, index, newValue) {
  const newList = [...list];
  newList[index] = newValue;
  setList(newList);
}

const defaultSize = 3;

function ChooseTeamMembers({
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
      {[2, 3, 4].map((n) => (
        <input
          type="button"
          key={n}
          value={n}
          onClick={() => setSize(n)}
          disabled={size === n}
        />
      ))}
      {[
        ['팀 1', ls],
        ['팀 2', rs],
      ].map(([teamName, list], teamIndex) => (
        <Fragment key={teamName}>
          <label className={style.label}>
            {teamName}
          </label>
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
      <input
        type="submit"
        value={nextValue}
        disabled={!done}
        onClick={onSubmit}
      />
    </form>
  );
}

function ChooseTeamOrder({
  size,
  side,
  list,
  order,
  setOrder,
  idMap,
  nextValue,
  onDone,
}) {
  const updateOrder = useCallback(
    (id, index) => {
      setOrder((array) => {
        const newArray = [...array];
        newArray[index] = id;
        return newArray;
      });
    },
    [setOrder]
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onDone(event);
    },
    [onDone]
  );

  const done = order.every((id) => id !== null);

  return (
    <form className={style.ChooseTeamOrder}>
      <div className={style.gameOrderLabel}>순서</div>
      <div className={style.gameOrder}>
        {gameOrder[size][side].map((n, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div key={index}>{n}</div>
        ))}
      </div>
      {[...new Array(size).keys()].map((row) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <Fragment key={row}>
          <div className={style.label}>선수 {size * side + row + 1}</div>
          {list.map((id, col) => (
            <input
              /* eslint-disable-next-line react/no-array-index-key */
              key={`${id}-${row}-${col}`}
              type="button"
              value={idMap.get(id)?.firstName ?? '선택'}
              className={order[row] === id ? style.selected : ''}
              onClick={() => updateOrder(id, row)}
            />
          ))}
        </Fragment>
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

export default function AddTeamGame() {
  const [persons, setPersons] = useState();
  const [size, setSize] = useState(3);
  const [ls, setLs] = useState(new Array(defaultSize).fill(null));
  const [rs, setRs] = useState(new Array(defaultSize).fill(null));
  const [lOrder, setLOrder] = useState(new Array(defaultSize).fill(null));
  const [rOrder, setROrder] = useState(new Array(defaultSize).fill(null));
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    get('/api/person/today', setPersons);
  }, []);

  useEffect(() => {
    setLs(new Array(size).fill(null));
    setRs(new Array(size).fill(null));
    setLOrder(new Array(size).fill(null));
    setROrder(new Array(size).fill(null));
  }, [size]);

  const idMap = useMemo(() => toPersonIdMap(persons), [persons]);

  const next = useCallback(() => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const rounds = buildRounds(size, lOrder, rOrder);
      const game = { type: size, ls: lOrder, rs: rOrder, rounds };
      post('/api/crud/game', { game }, () => {
        navigate('/');
      });
    }
  }, [step, size, lOrder, rOrder, navigate]);

  if (persons === undefined) {
    return null;
  }

  return (
    <div className={style.AddTeamGame}>
      <div className="header">단체전 시작</div>
      {step === 0 && (
        <ChooseTeamMembers
          size={size}
          setSize={setSize}
          ls={ls}
          setLs={setLs}
          rs={rs}
          setRs={setRs}
          persons={persons}
          idMap={idMap}
          nextValue="팀 1 순서 선택"
          onDone={next}
        />
      )}
      {[
        [ls, lOrder, setLOrder, '팀 2 순서 선택'],
        [rs, rOrder, setROrder, '단체전 시작'],
      ].map(
        ([list, order, setOrder, nextValue], index) =>
          step === index + 1 && (
            <ChooseTeamOrder
              size={size}
              side={index}
              list={list}
              order={order}
              setOrder={setOrder}
              idMap={idMap}
              nextValue={nextValue}
              onDone={next}
            />
          )
      )}
    </div>
  );
}
