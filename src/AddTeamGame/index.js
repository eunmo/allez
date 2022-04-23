import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get, postGetJson as post, toPersonIdMap, buildRounds } from '../utils';
import ChooseTeamMembers from './ChooseTeamMembers';
import ChooseTeamOrder from './ChooseTeamOrder';
import style from './index.module.css';

const defaultSize = 3;

export default function AddTeamGame() {
  const [persons, setPersons] = useState();
  const [size, setSize] = useState(defaultSize);
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
      post('/api/crud/game', { game }, ({ gid }) => {
        navigate(`/game/team/edit/${gid}`);
      });
    }
  }, [step, size, lOrder, rOrder, navigate]);

  if (persons === undefined) {
    return null;
  }

  let body = null;

  switch (step) {
    case 0:
      body = (
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
      );
      break;
    case 1:
      body = (
        <ChooseTeamOrder
          size={size}
          side={0}
          list={ls}
          order={lOrder}
          setOrder={setLOrder}
          idMap={idMap}
          nextValue="팀 2 순서 선택"
          onDone={next}
        />
      );
      break;
    case 2:
      body = (
        <ChooseTeamOrder
          size={size}
          side={1}
          list={rs}
          order={rOrder}
          setOrder={setROrder}
          idMap={idMap}
          nextValue="단체전 시작"
          onDone={next}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className={style.AddTeamGame}>
      <div className="header">단체전 시작</div>
      {body}
    </div>
  );
}
