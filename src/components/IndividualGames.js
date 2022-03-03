import { Fragment, useMemo, useState } from 'react';

import { sortByName } from '../utils';
import LinkButton from './LinkButton';
import Score from './Score';
import style from './IndividualGames.module.css';

export default function IndividualGames({ games, idMap }) {
  const [selected, setSelected] = useState(-1);

  const participants = useMemo(() => {
    const sorted = [...new Set(games.flatMap(({ ls, rs }) => [...ls, ...rs]))]
      .map((id) => idMap.get(id))
      .sort(sortByName);
    sorted.unshift({ id: -1, firstName: '전체' });
    return sorted;
  }, [games, idMap]);

  const individualGames = useMemo(() => {
    const indexed = games.map((game, index) => ({
      ...game,
      index: games.length - index,
    }));
    if (selected !== -1) {
      return indexed.filter(
        ({ type, ls, rs }) => type === 1 && [...ls, ...rs].includes(selected)
      );
    }
    return indexed.filter(({ type }) => type === 1);
  }, [games, selected]);

  return (
    <div className={style.IndividualGames}>
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
        {individualGames.map(({ id, rounds, index }) =>
          rounds.map(({ l, r, lp, rp }) => (
            <Fragment key={`${id}-${l}-${r}`}>
              <div className="light-text">{index}</div>
              <div className={lp > rp ? 'highlight' : ''}>
                {idMap.get(l).firstName}
              </div>
              <Score scores={[lp, rp]} />
              <Score scores={[rp, lp]} />
              <div className={lp < rp ? 'highlight' : ''}>
                {idMap.get(r).firstName}
              </div>
              <LinkButton
                size="sm"
                to={`/game/individual/edit/${id}`}
                style={{ borderRadius: '20px' }}
              >
                <b>︙</b>
              </LinkButton>
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
