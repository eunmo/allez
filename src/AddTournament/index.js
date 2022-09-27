import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBranch } from '../BranchContext';
import {
  get,
  postGetJson as post,
  toPersonIdMap,
  buildPoolRounds,
} from '../utils';
import AssignPools from './AssignPools';
import ChooseParticipants from './ChooseParticipants';
import style from './index.module.css';

export default function AddTournament() {
  const [persons, setPersons] = useState();
  const [participants, setParticipants] = useState([]);
  const [pools, setPools] = useState([]);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { branch, branchId } = useBranch();

  useEffect(() => {
    get(`/api/person/today/${branchId}`, setPersons);
  }, [branchId]);

  const idMap = useMemo(() => toPersonIdMap(persons), [persons]);

  const next = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const submit = useCallback(() => {
    const poolsWithRounds = pools.map((pool) => ({
      ...pool,
      rounds: buildPoolRounds(pool.participants),
    }));
    const game = {
      type: 'T',
      ls: participants,
      rs: [],
      pools: poolsWithRounds,
    };
    post('/api/crud/game', { game, branch: branchId }, ({ gid }) => {
      navigate(`/${branch}/game/tournament/edit/${gid}`);
    });
  }, [branch, branchId, participants, pools, navigate]);

  if (persons === undefined) {
    return null;
  }

  let body = null;

  switch (step) {
    case 0:
      body = (
        <ChooseParticipants
          list={participants}
          setList={setParticipants}
          persons={persons}
          nextValue="뿔 배정"
          onDone={next}
        />
      );
      break;
    case 1:
      body = (
        <AssignPools
          ids={participants}
          pools={pools}
          setPools={setPools}
          idMap={idMap}
          nextValue="토너먼트 시작"
          onDone={submit}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className={style.AddTournament}>
      <div className="header">토너먼트 시작</div>
      {body}
    </div>
  );
}
