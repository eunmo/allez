import { Fragment, useMemo } from 'react';

import LinkButton from './LinkButton';
import Score from './Score';
import style from './TeamGames.module.css';

function sum(array, key) {
  return array.reduce((prev, { [key]: val }) => prev + val, 0);
}

export default function TeamGames({ games, idMap }) {
  const teamGames = useMemo(() => {
    return games
      .filter(({ type }) => [2, 3, 4].includes(type))
      .map(({ rounds, ...rest }) => ({
        ...rest,
        rounds,
        lp: sum(rounds, 'lp'),
        rp: sum(rounds, 'rp'),
      }));
  }, [games]);

  return (
    <div className={style.TeamGames}>
      {teamGames.map(({ id, ls, lp, rs, rp }, index) => (
        <Fragment key={id}>
          <div className="light-text">{teamGames.length - index}</div>
          <div className={`${style.members} ${lp > rp ? 'highlight' : ''}`}>
            {ls.map((pid) => (
              <div key={pid}>{idMap.get(pid).firstName}</div>
            ))}
          </div>
          <Score scores={[lp, rp]} />
          <Score scores={[rp, lp]} />
          <div className={`${style.members} ${lp < rp ? 'highlight' : ''}`}>
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
        </Fragment>
      ))}
    </div>
  );
}
