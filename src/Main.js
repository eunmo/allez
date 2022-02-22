import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { GameList, LinkButton } from './components';
import { get } from './utils';
import style from './Main.module.css';

function Menu() {
  return (
    <>
      <LinkButton size="lg" to="/game/individual/add">
        개인전 기록
      </LinkButton>
      <LinkButton to="/game/team/add">단체전 시작</LinkButton>
      <LinkButton to="/game/calendar">과거 기록 열람</LinkButton>
      <LinkButton to="/person">출석 체크</LinkButton>
    </>
  );
}

function getTime() {
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  return [hour, minute].map((n) => `${n}`.padStart(2, '\xa0')).join(':');
}

function Clock() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const timerId = setInterval(() => setTime(getTime()), 1000 /* 1s */);
    return () => clearInterval(timerId);
  }, []);

  return <div className={style.Clock}>{time}</div>;
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

  return (
    <GameList games={games} today>
      {isLarge && <Clock />}
      <Menu />
    </GameList>
  );
}
