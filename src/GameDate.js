import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GameList } from './components';
import { get, formatDate } from './utils';

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
