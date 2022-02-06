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

function PointInputValue({ digit, onClick, disabled }) {
  return (
    <input
      type="button"
      value={digit}
      onClick={(e) => onClick(e.target.value)}
      disabled={disabled}
    />
  );
}

function PointInput({ value, setValue, onDone }) {
  const onClickDigit = useCallback(
    (digit) => {
      setValue(`${value ?? ''}${digit}`);
      onDone();
    },
    [value, setValue, onDone]
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
      <input
        type="button"
        value="C"
        onClick={() => setValue()}
        disabled={!value}
      />
      <PointInputValue digit={0} onClick={onClickDigit} disabled={!value} />
      <input type="button" value="⌫" onClick={backspace} disabled={!value} />
    </div>
  );
}

function getInputClass(value, target, selected) {
  if (target === selected) {
    return style.selectedInput;
  }

  return value ? undefined : style.noInput;
}

const steps = ['person1', 'point1', 'point2', 'person2'];

export default function AddGame() {
  const [persons, setPersons] = useState(null);
  const [l, setL] = useState();
  const [r, setR] = useState();
  const [lp, setLp] = useState();
  const [rp, setRp] = useState();
  const [step, setStep] = useState(steps[0]);
  const [automatic, setAutomatic] = useState(true);
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

  const next = useCallback(() => {
    if (automatic) {
      const index = steps.findIndex((e) => e === step) + 1;
      if (index === steps.length) {
        setStep();
      } else {
        setStep(steps[index]);
      }
    }
  }, [step, automatic]);

  const selectPerson = useCallback(
    (target, id) => {
      if (target === 'person1') {
        setL(id);
      } else {
        setR(id);
      }
      next();
    },
    [next]
  );

  const manualInput = useCallback((target) => {
    setAutomatic(false);
    setStep(target);
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
        <input
          type="button"
          value={l ? idMap.get(l) : '선택'}
          className={getInputClass(l, 'person1', step)}
          onClick={() => manualInput('person1')}
        />
        <input
          type="button"
          value={lp || '입력'}
          className={getInputClass(lp, 'point1', step)}
          onClick={() => manualInput('point1')}
        />
        <input
          type="button"
          value={rp || '입력'}
          className={getInputClass(rp, 'point2', step)}
          onClick={() => manualInput('point2')}
        />
        <input
          type="button"
          value={r ? idMap.get(r) : '선택'}
          className={getInputClass(r, 'person2', step)}
          onClick={() => manualInput('person2')}
        />
        {['person1', 'person2'].includes(step) && (
          <PersonSelect
            sections={sections}
            onClick={(id) => selectPerson(step, id)}
          />
        )}
        {['point1', 'point2'].includes(step) && (
          <PointInput
            value={step === 'point1' ? lp : rp}
            setValue={step === 'point1' ? setLp : setRp}
            onDone={automatic ? next : () => {}}
          />
        )}
        <input type="submit" value="전송" disabled={!(l && r && lp && rp)} />
      </form>
    </div>
  );
}
