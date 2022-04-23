import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PersonSelect, PointInput } from './components';
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

  const updateRound = useCallback(
    (value) => {
      const { rounds, ...rest } = game;
      const [index, side] = selected;
      const newRounds = [...rounds];
      newRounds[index][side] = value;
      setGame({ ...rest, rounds: newRounds });
    },
    [game, selected]
  );

  const addRow = useCallback(() => {
    const { rounds, ...rest } = game;
    const { ls, rs } = game;
    const newRound = {};

    if (ls.length === 1) {
      const [l] = ls;
      newRound.l = l;
    }
    if (rs.length === 1) {
      const [r] = rs;
      newRound.r = r;
    }

    setGame({ ...rest, rounds: [...rounds, newRound] });
    setSelected();
  }, [game, setGame]);

  const deleteRow = useCallback(() => {
    const { rounds, ...rest } = game;
    const newRounds = [...rounds];
    newRounds.pop();
    setGame({ ...rest, rounds: newRounds });
    setSelected();
  }, [game, setGame]);

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

  const lPersons = useMemo(
    () => game?.ls.map((l) => idMap?.get(l)),
    [game, idMap]
  );
  const rPersons = useMemo(
    () => game?.rs.map((r) => idMap?.get(r)),
    [game, idMap]
  );

  if (game === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  const { type, rounds } = game;
  const done = rounds.every(
    ({ lp, rp }) => lp !== undefined && rp !== undefined
  );
  const persons = { l: lPersons, r: rPersons };

  return (
    <div className={style.EditTeamGame}>
      <div className="header">단체전 진행</div>
      <form onSubmit={submit}>
        <label className={style.header}>선수</label>
        <label className={style.header}>소계</label>
        <label className={style.header}>누계</label>
        <label className={style.header}>득점</label>
        <label className={style.header}>누계</label>
        <label className={style.header}>소계</label>
        <label className={style.header}>선수</label>
        {rounds.map(({ l, r, lp, rp }, index) => (
          <Fragment
            /* eslint-disable-next-line react/no-array-index-key */
            key={index}
          >
            {type === 0 ? (
              <input
                type="button"
                value={idMap.get(l)?.firstName ?? '선택'}
                className={getInputClass(l, [index, 'l'], selected)}
                onClick={() => toggle(index, 'l')}
              />
            ) : (
              <label>{idMap.get(l).firstName}</label>
            )}
            <label className="light-text">{perRound[index][0]}</label>
            <input
              type="button"
              value={lp ?? '입력'}
              className={getInputClass(lp, [index, 'lp'], selected)}
              onClick={() => toggle(index, 'lp')}
            />
            <label className="light-text">{index * 5 + 5}</label>
            <input
              type="button"
              value={rp ?? '입력'}
              className={getInputClass(rp, [index, 'rp'], selected)}
              onClick={() => toggle(index, 'rp')}
            />
            <label className="light-text">{perRound[index][1]}</label>
            {type === 0 ? (
              <input
                type="button"
                value={idMap.get(r)?.firstName ?? '선택'}
                className={getInputClass(r, [index, 'r'], selected)}
                onClick={() => toggle(index, 'r')}
              />
            ) : (
              <label>{idMap.get(r).firstName}</label>
            )}
          </Fragment>
        ))}
        {['l', 'r'].includes(selected?.[1]) && (
          <PersonSelect
            persons={persons[selected[1]]}
            cn={style.personSelect}
            alignRight={selected[1] === 'r'}
            onClick={updateRound}
          />
        )}
        {['lp', 'rp'].includes(selected?.[1]) && (
          <div className={style.pointInput}>
            <PointInput
              value={rounds[selected[0]][selected[1]]}
              setValue={updateRound}
            />
          </div>
        )}
        {type === 0 && (
          <>
            <input
              type="button"
              value="마지막 릴레이 삭제"
              disabled={rounds.length === 0}
              className={style.deleteRow}
              onClick={deleteRow}
            />
            <input
              type="button"
              value="릴레이 추가"
              className={style.addRow}
              onClick={addRow}
            />
          </>
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
