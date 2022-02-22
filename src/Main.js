import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { GameList, LinkButton } from './components';
import { get } from './utils';
import style from './Main.module.css';

function getTime() {
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  return [hour, minute].map((n) => `${n}`.padStart(2, '0')).join(':');
}

function Clock() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const timerId = setInterval(() => setTime(getTime()), 1000 /* 1s */);
    return () => clearInterval(timerId);
  }, []);

  return <div className={`${style.Clock} ${style.span3}`}>{time}</div>;
}

function Menu() {
  const isLarge = useMediaQuery({ query: '(min-width: 601px)' });

  return (
    <div className={style.Menu}>
      <LinkButton size="lg" to="/game/individual/add" cn={style.span3}>
        개인전 기록
      </LinkButton>
      {isLarge && <Clock />}
      <LinkButton to="/game/team/add" cn={style.span2}>
        단체전 시작
      </LinkButton>
      <LinkButton to="/game/calendar" cn={style.span2}>
        과거 기록 열람
      </LinkButton>
      <LinkButton to="/person" cn={style.span2}>
        출석 체크
      </LinkButton>
    </div>
  );
}

export default function Main() {
  const [games, setGames] = useState();
  const isLarge = useMediaQuery({ query: '(min-width: 601px)' });

  useEffect(() => {
    const dateString = new Date().toISOString().substring(0, 10);
    get(`/api/game/date/${dateString}`, setGames);
  }, []);

  if (games === undefined || games.length === 0) {
    return <Menu />;
  }

  if (isLarge) {
    return (
      <>
        <Menu />
        <GameList games={games} today />
      </>
    );
  }

  return (
    <GameList games={games} today>
      <Menu />
    </GameList>
  );
}
