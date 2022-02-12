import { useCallback, useEffect, useMemo, useState } from 'react';

import { get, toPersonIdMap } from '../utils';
import PersonSelect from './PersonSelect';
import style from './IndividualGameForm.module.css';

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

function parseValue(value) {
  return parseInt(value ?? '0', 10);
}

function PointInput({ value, setValue, onDone }) {
  const onClickDigit = useCallback(
    (digit) => {
      setValue(`${parseValue(value) * 10 + parseValue(digit)}`);
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
    } else {
      setValue(value.substring(0, value.length - 1));
    }
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
      <PointInputValue digit={0} onClick={onClickDigit} />
      <input type="button" value="⌫" onClick={backspace} disabled={!value} />
    </div>
  );
}

function getInputClass(value, target, selected) {
  if (target === selected) {
    return style.selectedInput;
  }

  if (value === undefined) {
    return style.noInput;
  }

  return '';
}

const steps = ['person1', 'point1', 'point2', 'person2'];

export default function IndividualGameForm({
  title,
  l: defaultL,
  r: defaultR,
  lp: defaultLp,
  rp: defaultRp,
  editMode = false,
  submit,
  deleteCallback,
  today = true,
}) {
  const [persons, setPersons] = useState();
  const [l, setL] = useState(defaultL);
  const [r, setR] = useState(defaultR);
  const [lp, setLp] = useState(defaultLp);
  const [rp, setRp] = useState(defaultRp);
  const [step, setStep] = useState(steps[0]);
  const [automatic, setAutomatic] = useState(true);

  useEffect(() => {
    get(`/api/person/${today ? 'today' : 'list'}`, setPersons);
  }, [today]);

  useEffect(() => {
    if (editMode) {
      setStep(null);
      setAutomatic(false);
    } else {
      setStep(steps[0]);
      setAutomatic(true);
    }
  }, [editMode]);

  const idMap = useMemo(() => toPersonIdMap(persons), [persons]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const [lpi, rpi] = [lp, rp].map(parseValue);
      const rounds = [{ l, r, lp: lpi, rp: rpi }];
      const game = { type: 1, ls: [l], rs: [r], rounds };
      submit(game);
    },
    [l, lp, r, rp, submit]
  );

  const next = useCallback(() => {
    if (automatic) {
      const index = steps.findIndex((e) => e === step) + 1;
      if (index === steps.length) {
        setStep();
      } else {
        setStep(steps[index]);
      }
    } else {
      setStep();
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
    if (target === 'point1') {
      setLp();
    }
    if (target === 'point2') {
      setRp();
    }
    setAutomatic(false);
    setStep(target);
  }, []);

  if (persons === undefined) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.IndividualGameForm}>
      <div className="header">{title}</div>
      <form onSubmit={onSubmit}>
        <label>선수 1</label>
        <label>점수 1</label>
        <label>점수 2</label>
        <label>선수 2</label>
        <input
          type="button"
          value={idMap.get(l)?.firstName ?? '선택'}
          className={getInputClass(l, 'person1', step)}
          onClick={() => manualInput('person1')}
        />
        <input
          type="button"
          value={lp ?? '입력'}
          className={getInputClass(lp, 'point1', step)}
          onClick={() => manualInput('point1')}
        />
        <input
          type="button"
          value={rp ?? '입력'}
          className={getInputClass(rp, 'point2', step)}
          onClick={() => manualInput('point2')}
        />
        <input
          type="button"
          value={idMap.get(r)?.firstName ?? '선택'}
          className={getInputClass(r, 'person2', step)}
          onClick={() => manualInput('person2')}
        />
        {['person1', 'person2'].includes(step) && (
          <PersonSelect
            persons={persons}
            cn={style.personSelect}
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
        <input
          type="submit"
          value={editMode ? '수정' : '저장'}
          disabled={!(l && r && lp && rp)}
        />
        {deleteCallback && (
          <input
            type="button"
            value="삭제"
            className={style.delete}
            onClick={deleteCallback}
          />
        )}
      </form>
    </div>
  );
}
