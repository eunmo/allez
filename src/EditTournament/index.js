import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useBranch } from '../BranchContext';
import {
  fetchDelete,
  get,
  put,
  toPersonIdMap,
  calc,
  sortByName,
  sortByStat,
} from '../utils';
import Pool from './Pool';
import Rank from './Rank';
import style from './index.module.css';

const emptyRank = { victories: 0, matches: 0, scored: 0, received: 0 };

function calculateRanking({ pools, ls: ids }, idMap) {
  const games = pools
    .flatMap(({ rounds }) => rounds)
    .filter(({ lp, rp }) => lp !== undefined && rp !== undefined);
  const persons = ids.map((id) => ({ ...idMap.get(id), ...emptyRank }));
  const personMap = new Map(persons.map((person) => [person.id, person]));

  games.forEach(({ l, r, lp, rp }) => {
    if (lp === undefined || rp === undefined) {
      return;
    }

    const left = personMap.get(l);
    const right = personMap.get(r);

    left.matches += 1;
    right.matches += 1;
    left.scored += lp;
    right.scored += rp;
    left.received += rp;
    right.received += lp;

    if (lp > rp) {
      left.victories += 1;
    } else if (rp > lp) {
      right.victories += 1;
    }
  });

  const calculated = persons.map((person) => ({
    ...person,
    ...calc(person),
  }));

  const ranked = [...calculated].sort((p1, p2) => {
    const statDifference = sortByStat(p1, p2);

    if (statDifference !== 0) {
      return statDifference;
    }

    return sortByName(p1, p2);
  });

  return ranked.map((person, index) => ({ ...person, rank: index + 1 }));
}

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
      const newGame = { ...rest, pools: newPools };
      newGame.ranking = calculateRanking(newGame, idMap);
      setGame(newGame);
    },
    [game, idMap]
  );

  if (game === undefined || idMap === null) {
    return null;
  }

  const { pools, ranking, ls: ids } = game;

  return (
    <div className={style.EditTournament}>
      <div className="header">{`${ids.length}인 토너먼트`}</div>
      {pools.map((pool) => (
        <Pool key={pool.index} pool={pool} setPool={setPool} idMap={idMap} />
      ))}
      <Rank ranking={ranking} />
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
