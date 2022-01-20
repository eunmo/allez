import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayPersonType, get, groupByPersonType, post } from './utils';
import style from './AddGame.module.css';

function PersonSelect({ sections, onClick }) {
  return (
    <div className={style.PersonSelect}>
      {sections.map(({ code, persons }) => (
        <div key={code}>
          <label>{displayPersonType(code)}</label>
          {persons.map(({ firstName, id }) => (
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

function PointInputValue({ digit, onClick }) {
  return (
    <input
      type="button"
      value={digit}
      onClick={(e) => onClick(e.target.value)}
    />
  );
}

function PointInput({ value, setValue }) {
  const onClickDigit = useCallback(
    (digit) => {
      if (digit === '0' && !(value && value.length > 0)) {
        return;
      }

      setValue(`${value ?? ''}${digit}`);
    },
    [value, setValue]
  );

  const backspace = useCallback(() => {
    if (!value) {
      return;
    }

    if (value.length === 1) {
      setValue();
    }

    setValue(value.substring(0, value.length - 1));
  }, [value, setValue]);

  return (
    <div className={style.PointInput}>
      {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((d) => (
        <PointInputValue key={d} digit={d} onClick={onClickDigit} />
      ))}
      <input type="button" value="C" onClick={() => setValue()} />
      <PointInputValue digit={0} onClick={onClickDigit} />
      <input type="button" value="⌫" onClick={backspace} />
    </div>
  );
}

export default function AddGame() {
  const [persons, setPersons] = useState(null);
  const [l, setL] = useState();
  const [r, setR] = useState();
  const [lp, setLp] = useState();
  const [rp, setRp] = useState();
  const [selected, setSelected] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    get('/api/person/list', setPersons);
  }, []);

  const sections = useMemo(() => groupByPersonType(persons), [persons]);
  const idMap = useMemo(
    () => new Map((persons ?? []).map(({ id, firstName }) => [id, firstName])),
    [persons]
  );

  const onSubmit = useCallback(() => {
    const rounds = [{ l, r, lp, rp }];
    const game = { type: 1, ls: [l], rs: [r], rounds };
    post('/api/crud/game', { game }, () => {
      navigate('/');
    });
  }, [l, lp, navigate, r, rp]);

  const selectPerson1 = useCallback((id) => {
    setL(id);
    setSelected();
  }, []);

  const selectPerson2 = useCallback((id) => {
    setR(id);
    setSelected();
  }, []);

  if (persons === undefined) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.AddGame}>
      <div className="header">경기 기록 추가</div>
      <form onSubmit={onSubmit}>
        <label>선수 1</label>
        <label>점수 1</label>
        <label>점수 2</label>
        <label>선수 2</label>
        <label>{l && idMap.get(l)}</label>
        <label>{lp}</label>
        <label>{rp}</label>
        <label>{r && idMap.get(r)}</label>
        <input
          type="button"
          value="선택"
          onClick={() => setSelected('person1')}
        />
        <input
          type="button"
          value="입력"
          onClick={() => setSelected('point1')}
        />
        <input
          type="button"
          value="입력"
          onClick={() => setSelected('point2')}
        />
        <input
          type="button"
          value="선택"
          onClick={() => setSelected('person2')}
        />
        {selected === 'person1' && (
          <PersonSelect sections={sections} onClick={selectPerson1} />
        )}
        {selected === 'point1' && <PointInput value={lp} setValue={setLp} />}
        {selected === 'point2' && <PointInput value={rp} setValue={setRp} />}
        {selected === 'person2' && (
          <PersonSelect sections={sections} onClick={selectPerson2} />
        )}
        <input type="submit" value="전송" disabled={!(l && r && lp && rp)} />
      </form>
    </div>
  );
}
