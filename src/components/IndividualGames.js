import { Fragment, useMemo } from 'react';

import LinkButton from './LinkButton';
import Score from './Score';
import style from './IndividualGames.module.css';

export default function IndividualGames({ games, idMap }) {
  const individualGames = useMemo(() => {
    return games.filter(({ type }) => type === 1);
  }, [games]);

  return (
    <div className={style.IndividualGames}>
      {individualGames.map(({ id, rounds }, index) =>
        rounds.map(({ l, r, lp, rp }) => (
          <Fragment key={`${id}-${l}-${r}`}>
            <div className="light-text">{games.length - index}</div>
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
  );
}
