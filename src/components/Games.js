import { useMemo, useState } from 'react';

import { sortByName } from '../utils';
import LinkButton from './LinkButton';
import Score from './Score';
import style from './Games.module.css';

function getScore(rounds, key) {
  return rounds.slice(-1)[0][key] ?? 0;
}

function getNameClassL(game, selected) {
  const { ls, lp, rp } = game;
  const isL = ls.includes(selected);

  if (lp > rp) {
    return isL ? style.selected : 'highlight';
  }

  return '';
}

function getNameClassR(game, selected) {
  const { rs, lp, rp } = game;
  const isR = rs.includes(selected);

  if (lp < rp) {
    return isR ? style.selected : 'highlight';
  }

  return '';
}

function IndividualGame({ game, idMap, selected }) {
  const { id, ls, rs, lp, rp, index } = game;
  const [l] = ls;
  const [r] = rs;
  return (
    <>
      <div className="light-text">{index}</div>
      <div className={getNameClassL(game, selected)}>
        {idMap.get(l).firstName}
      </div>
      <Score scores={[lp, rp]} />
      <Score scores={[rp, lp]} />
      <div className={getNameClassR(game, selected)}>
        {idMap.get(r).firstName}
      </div>
      <LinkButton
        size="sm"
        to={`/game/individual/edit/${id}`}
        style={{ borderRadius: '20px' }}
      >
        <b>︙</b>
      </LinkButton>
    </>
  );
}

function TeamGame({ game, idMap, selected }) {
  const { id, ls, rs, lp, rp, index } = game;
  return (
    <>
      <div className={`${style.teamIndex} light-text`}>{index}</div>
      <div className={`${style.members} ${getNameClassL(game, selected)}`}>
        {ls.map((pid) => (
          <div key={pid}>{idMap.get(pid).firstName}</div>
        ))}
      </div>
      <div className={style.score}>
        <Score scores={[lp, rp]} />
      </div>
      <div className={style.score}>
        <Score scores={[rp, lp]} />
      </div>
      <div className={`${style.members} ${getNameClassR(game, selected)}`}>
        {rs.map((pid) => (
          <div key={pid}>{idMap.get(pid).firstName}</div>
        ))}
      </div>
      <div className={style.button}>
        <LinkButton
          size="sm"
          to={`/game/team/edit/${id}`}
          style={{ borderRadius: '20px' }}
        >
          <b>︙</b>
        </LinkButton>
      </div>
    </>
  );
}

export default function Games({ games, idMap }) {
  const [selected, setSelected] = useState(-1);

  const indexedGames = useMemo(() => {
    return games.map((game, index) => ({
      ...game,
      index: games.length - index,
      lp: getScore(game.rounds, 'lp'),
      rp: getScore(game.rounds, 'rp'),
    }));
  }, [games]);

  const participants = useMemo(() => {
    const sorted = [...new Set(games.flatMap(({ ls, rs }) => [...ls, ...rs]))]
      .map((id) => idMap.get(id))
      .sort(sortByName);
    if (sorted.length > 1) {
      sorted.unshift({ id: -1, firstName: '전체' });
    }
    return sorted;
  }, [games, idMap]);

  const filteredGames = useMemo(() => {
    if (selected !== -1) {
      return indexedGames.filter(({ ls, rs }) =>
        [...ls, ...rs].includes(selected)
      );
    }
    return indexedGames;
  }, [indexedGames, selected]);

  return (
    <div className={style.Games}>
      <div className={style.participants}>
        {participants.map(({ id, firstName }) => (
          <button
            key={id}
            className={selected === id ? style.selected : style.participant}
            type="button"
            onClick={() => setSelected(id)}
          >
            {firstName}
          </button>
        ))}
      </div>
      <div className={style.games}>
        {filteredGames.map((game) => {
          const { type, id } = game;

          if (type === 1) {
            return (
              <IndividualGame
                key={id}
                game={game}
                idMap={idMap}
                selected={selected}
              />
            );
          }

          if ([2, 3, 4].includes(type)) {
            return (
              <TeamGame
                key={id}
                game={game}
                idMap={idMap}
                selected={selected}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}