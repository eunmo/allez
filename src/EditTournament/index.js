import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useBranch } from '../BranchContext';
import { fetchDelete, get, put, toPersonIdMap } from '../utils';
import Pool from './Pool';
import style from './index.module.css';

export default function EditTournament() {
  const [game, setGame] = useState();
  const [idMap, setIdMap] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { branch, branchId } = useBranch();

  useEffect(() => {
    get(`/api/game/id/${id}`, (data) => setGame(data.game));
  }, [id]);

  useEffect(() => {
    get(`/api/person/today/${branchId}`, (data) =>
      setIdMap(toPersonIdMap(data))
    );
  }, [branchId]);

  const onSave = useCallback(() => {
    put('/api/crud/game', { id, game, branch }, () => {
      get(`/api/game/id/${id}`, (data) => setGame(data.game));
    });
  }, [game, branch, id]);

  const deleteCallback = useCallback(() => {
    fetchDelete('/api/crud/game', { id }, () => {
      navigate(`/${branch}`);
    });
  }, [navigate, id, branch]);

  const setPool = useCallback(
    (pool) => {
      const { pools, ...rest } = game;
      const newPools = pools.map((p) => (p.index === pool ? pool : p));
      setGame({ ...rest, pools: newPools });
    },
    [game]
  );

  if (game === undefined || idMap === null) {
    return null;
  }

  const { pools } = game;

  return (
    <div className={style.EditTournament}>
      {pools.map((pool) => (
        <Pool key={pool.index} pool={pool} setPool={setPool} idMap={idMap} />
      ))}
      <input
        type="button"
        value="저장"
        className={style.save}
        onClick={onSave}
      />
      <input
        type="button"
        value="토너먼트 삭제"
        className={style.delete}
        onClick={deleteCallback}
      />
    </div>
  );
}
