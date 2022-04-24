import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GameList } from './components';
import { useBranch } from './BranchContext';
import { get, formatDate } from './utils';

export default function GameDate() {
  const [games, setGames] = useState();
  const [persons, setPersons] = useState();
  const { date } = useParams();
  const { branchId } = useBranch();

  useEffect(() => {
    get(`/api/game/date/${branchId}/${date}`, (data) => {
      const { games: gs, persons: ps } = data;
      setGames(gs);
      setPersons(ps);
    });
  }, [branchId, date]);

  return (
    <div>
      <div className="header">{formatDate(date)}</div>
      <div>{games && <GameList games={games} persons={persons} />}</div>
    </div>
  );
}
