import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GameList } from './components';
import { get } from './utils';

function formatDate(date) {
  const m = parseInt(date.substring(5, 7), 10);
  const d = parseInt(date.substring(8, 10), 10);

  return `${m}월 ${d}일`;
}

export default function GameDate() {
  const [games, setGames] = useState();
  const { date } = useParams();

  useEffect(() => {
    get(`/api/game/date/${date}`, setGames);
  }, [date]);

  return (
    <div>
      <div className="header">{formatDate(date)}</div>
      <div>{games && <GameList games={games} />}</div>
    </div>
  );
}
