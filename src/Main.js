import { useEffect, useState } from 'react';

import { GameList, LinkButton } from './components';
import { get } from './utils';

function Menu() {
  return (
    <>
      <LinkButton size="lg" to="/game/individual/add">
        개인전 기록
      </LinkButton>
      <LinkButton size="lg" to="/game/team/add">
        단체전 시작
      </LinkButton>
      <LinkButton to="/game/calendar">과거 기록 열람</LinkButton>
      <LinkButton to="/person">출석 체크</LinkButton>
    </>
  );
}

export default function Main() {
  const [games, setGames] = useState();

  useEffect(() => {
    const dateString = new Date().toISOString().substring(0, 10);
    get(`/api/game/date/${dateString}`, setGames);
  }, []);

  if (games === undefined || games.length === 0) {
    return <Menu />;
  }

  return (
    <GameList games={games} today>
      <Menu />
    </GameList>
  );
}
