import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PointInput } from './components';
import {
  fetchDelete,
  get,
  put,
  toPersonIdMap,
  parseValue,
  parseRounds,
} from './utils';
import style from './EditTeamGame.module.css';

function getInputClass(value, target, selected) {
  if (target[0] === selected?.[0] && target[1] === selected?.[1]) {
    return style.selectedInput;
  }

  if (value === undefined) {
    return 'light-text';
  }

  return '';
}

export default function EditTeamGame() {
  const [game, setGame] = useState();
  const [idMap, setIdMap] = useState(null);
  const [selected, setSelected] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/id/${id}`, setGame);
  }, [id]);

  useEffect(() => {
    get('/api/person/list', (data) => setIdMap(toPersonIdMap(data)));
  }, []);

  const submit = useCallback(
    (event) => {
      event.preventDefault();
      const { type, ls, rs, rounds } = game;
      const newGame = { type, ls, rs, rounds: parseRounds(rounds) };
      put('/api/crud/game', { id, game: newGame }, () => {
        navigate('/');
      });
    },
    [navigate, id, game]
  );

  const deleteCallback = useCallback(() => {
    fetchDelete('/api/crud/game', { id }, () => {
      navigate('/');
    });
  }, [navigate, id]);

  const toggle = useCallback(
    (index, side) => {
      if (index === selected?.[0] && side === selected?.[1]) {
        setSelected();
      } else {
        setSelected([index, side]);
      }
    },
    [selected]
  );

  const setPoint = useCallback(
    (value) => {
      const { rounds, ...rest } = game;
      const [index, side] = selected;
      const newRounds = [...rounds];
      newRounds[index][side] = value;
      setGame({ ...rest, rounds: newRounds });
      if (
        side === 'rp' &&
        ((index === 0 && value?.length === 1) || value?.length === 2)
      ) {
        setSelected();
      } else if (
        side === 'lp' &&
        ((index === 0 && value?.length === 1) || value?.length === 2)
      ) {
        setSelected([index, 'rp']);
      }
    },
    [game, selected]
  );

  const perRound = useMemo(
    () =>
      game?.rounds.map((round, index) => {
        const prev = game.rounds[index - 1] ?? { lp: '0', rp: '0' };
        return ['lp', 'rp'].map((key) => {
          const cur = round[key];
          const pre = prev[key];
          if (cur === undefined || pre === undefined) {
            return null;
          }
          const val = parseValue(cur) - parseValue(pre);
          return val >= 0 ? val : null;
        });
      }),
    [game]
  );

  if (game === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  const { rounds } = game;
  const done = rounds.every(
    ({ lp, rp }) => lp !== undefined && rp !== undefined
  );

  return (
    <div className={style.EditTeamGame}>
      <div className="header">단체전 진행</div>
      <form onSubmit={submit}>
        <label className="highlight">선수</label>
        <label className="highlight">소계</label>
        <label className="highlight">누계</label>
        <label className="highlight">누계</label>
        <label className="highlight">소계</label>
        <label className="highlight">선수</label>
        {rounds.map(({ l, r, lp, rp }, index) => (
          <Fragment key={`${l}-${r}`}>
            <div className={style.text}>{idMap.get(l).firstName}</div>
            <div className={style.text}>{perRound[index][0]}</div>
            <input
              type="button"
              value={lp}
              className={getInputClass(lp, [index, 'lp'], selected)}
              onClick={() => toggle(index, 'lp')}
            />
            <input
              type="button"
              value={rp}
              className={getInputClass(rp, [index, 'rp'], selected)}
              onClick={() => toggle(index, 'rp')}
            />
            <div className={style.text}>{perRound[index][1]}</div>
            <div className={style.text}>{idMap.get(r).firstName}</div>
          </Fragment>
        ))}
        {selected && (
          <div className={style.pointInput}>
            <PointInput
              value={rounds[selected[0]][selected[1]]}
              setValue={setPoint}
            />
          </div>
        )}
        <input type="submit" value="저장" disabled={!done} />
        <input
          type="button"
          value="삭제"
          className={style.delete}
          onClick={deleteCallback}
        />
      </form>
    </div>
  );
}
