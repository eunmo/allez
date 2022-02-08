import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import GameList from './GameList';
import { get } from './utils';

export default function GameDate() {
  const [games, setGames] = useState();
  const { date } = useParams();

  useEffect(() => {
    get(`/api/game/date/${date}`, setGames);
  }, [date]);

  return (
    <div>
      <div className="header">{date}</div>
      <div>{games && <GameList games={games} />}</div>
    </div>
  );
}
