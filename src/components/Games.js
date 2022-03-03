import { useMemo, useState } from 'react';

import { sortByName } from '../utils';
import LinkButton from './LinkButton';
import Score from './Score';
import style from './Games.module.css';

function getScore(rounds, key) {
  return rounds.slice(-1)[0][key] ?? 0;
}

function IndividualGame({ game, idMap }) {
  const { id, ls, rs, lp, rp, index } = game;
  const [l] = ls;
  const [r] = rs;
  return (
    <>
      <div className="light-text">{index}</div>
      <div className={lp > rp ? 'highlight' : ''}>{idMap.get(l).firstName}</div>
      <Score scores={[lp, rp]} />
      <Score scores={[rp, lp]} />
      <div className={lp < rp ? 'highlight' : ''}>{idMap.get(r).firstName}</div>
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

function TeamGame({ game, idMap }) {
  const { id, ls, rs, lp, rp, index } = game;
  return (
    <>
      <div className={`${style.teamIndex} light-text`}>{index}</div>
      <div className={`${style.members} ${lp > rp ? 'highlight' : ''}`}>
        {ls.map((pid, idIndex) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div key={`${pid}-${idIndex}`}>{idMap.get(pid).firstName}</div>
        ))}
      </div>
      <div className={style.score}>
        <Score scores={[lp, rp]} />
      </div>
      <div className={style.score}>
        <Score scores={[rp, lp]} />
      </div>
      <div className={`${style.members} ${lp < rp ? 'highlight' : ''}`}>
        {rs.map((pid, idIndex) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div key={`${pid}-${idIndex}`}>{idMap.get(pid).firstName}</div>
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
      return indexedGames
        .filter(({ ls, rs }) => [...ls, ...rs].includes(selected))
        .map((game) => {
          const { ls, rs, lp, rp } = game;
          if (rs.includes(selected)) {
            return { ...game, ls: rs, rs: ls, lp: rp, rp: lp };
          }

          return game;
        });
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
            return <IndividualGame key={id} game={game} idMap={idMap} />;
          }

          if ([2, 3, 4].includes(type)) {
            return <TeamGame key={id} game={game} idMap={idMap} />;
          }

          return null;
        })}
      </div>
    </div>
  );
}
