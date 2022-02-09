import { useEffect, useState } from 'react';

import GameList from './GameList';
import LinkButton from './LinkButton';
import { get } from './utils';
import style from './Main.module.css';

export default function Main() {
  const [games, setGames] = useState();

  useEffect(() => {
    const dateString = new Date().toISOString().substring(0, 10);
    get(`/api/game/date/${dateString}`, setGames);
  }, []);

  return (
    <div className={style.Main}>
      <div>
        <LinkButton size="lg" to="/game/add">경기 기록 추가</LinkButton>
        <LinkButton to="/game/calendar">과거 기록 열람</LinkButton>
        <LinkButton to="/person">출석 체크</LinkButton>
      </div>
      <div>{games && <GameList games={games} />}</div>
    </div>
  );
}
