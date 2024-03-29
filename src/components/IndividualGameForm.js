import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBranch } from '../BranchContext';
import { get, toPersonIdMap, parseRounds } from '../utils';
import PersonSelect from './PersonSelect';
import style from './IndividualGameForm.module.css';

function PointInput({ value, setValue, onDone }) {
  const onClick = useCallback(() => {
    setValue(value);
    onDone();
  }, [value, setValue, onDone]);

  return <input type="button" value={value} onClick={onClick} />;
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
}) {
  const [persons, setPersons] = useState();
  const [l, setL] = useState(defaultL);
  const [r, setR] = useState(defaultR);
  const [lp, setLp] = useState(defaultLp);
  const [rp, setRp] = useState(defaultRp);
  const [step, setStep] = useState(steps[0]);
  const [automatic, setAutomatic] = useState(true);
  const { branchId } = useBranch();

  useEffect(() => {
    get(`/api/person/today/${branchId}`, setPersons);
  }, [branchId]);

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
      const rounds = parseRounds([{ l, r, lp, rp }]);
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
        {[
          [idMap.get(l)?.firstName, l, 'person1'],
          [lp, lp, 'point1'],
          [rp, rp, 'point2'],
          [idMap.get(r)?.firstName, r, 'person2'],
        ].map(([displayValue, value, key]) => (
          <input
            key={key}
            type="button"
            value={displayValue ?? '선택'}
            className={getInputClass(value, key, step)}
            onClick={() => manualInput(key)}
          />
        ))}
        {['person1', 'person2'].includes(step) && (
          <PersonSelect
            persons={persons}
            cn={style.personSelect}
            onClick={(id) => selectPerson(step, id)}
            alignRight={step === 'person2'}
          />
        )}
        {['point1', 'point2'].includes(step) && (
          <div className={style.pointInput}>
            <label className={style.pointInputDivider}>점수 선택</label>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((v) => (
              <PointInput
                key={v}
                value={v}
                setValue={step === 'point1' ? setLp : setRp}
                onDone={automatic ? next : () => {}}
              />
            ))}
          </div>
        )}
        <input
          type="submit"
          value={editMode ? '수정' : '저장'}
          disabled={!(l && r && lp !== undefined && rp !== undefined)}
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
