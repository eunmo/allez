import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PoolRank, ResponsiveTabs } from '../components';
import { get, toPersonIdMap, formatDate } from '../utils';
import Elimination from './Elimination';
import FinalRank from './FinalRank';
import Pools from './Pools';
import style from './index.module.css';

const givenStyle = {
  gridGap: '16px',
  gridTemplateColumns: 'repeat(2, 1fr)',
};

export default function ViewTournament() {
  const [game, setGame] = useState();
  const [idMap, setIdMap] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/id/${id}`, (data) => {
      setGame(data.game);
      setIdMap(toPersonIdMap(data.persons));
    });
  }, [id]);

  if (game === undefined || idMap === null) {
    return null; // TODO: spinner
  }

  const { pools, ranking, elimination, ls: ids, time } = game;

  return (
    <div className={style.ViewTournament}>
      <div className="header">{`${formatDate(time)} ${
        ids.length
      }인 토너먼트`}</div>
      <ResponsiveTabs
        tabNames={['결과', '본선', '예선순위', '예선']}
        givenStyle={givenStyle}
      >
        <>
          <div className={style.tabName}>최종 순위</div>
          <FinalRank ranking={ranking} rounds={elimination} idMap={idMap} />
        </>
        <Elimination ranking={ranking} rounds={elimination} idMap={idMap} />
        <>
          <div className={style.tabName}>예선 순위</div>
          <PoolRank ranking={ranking} idMap={idMap} />
        </>
        <Pools pools={pools} idMap={idMap} />
      </ResponsiveTabs>
    </div>
  );
}
