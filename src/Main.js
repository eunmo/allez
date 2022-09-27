import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { GameList, LinkButton } from './components';
import { useBranch } from './BranchContext';
import { get } from './utils';
import style from './Main.module.css';

function getTime() {
  const now = new Date();
  const hour = now.getHours() % 12 || 12;
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
      {isLarge && <Clock />}
      <LinkButton size="lg" to="game/individual/add">
        개인전 기록
      </LinkButton>
      <LinkButton to="person">출석 체크</LinkButton>
      <LinkButton to="game/team/add">단체전 시작</LinkButton>
      <LinkButton to="person/rank">순위표</LinkButton>
      <LinkButton to="game/tournament/add">토너먼트 시작</LinkButton>
      <LinkButton to="game/calendar">과거 기록 열람</LinkButton>
    </div>
  );
}

export default function Main() {
  const [games, setGames] = useState();
  const [persons, setPersons] = useState();
  const isLarge = useMediaQuery({ query: '(min-width: 601px)' });
  const { branchId } = useBranch();

  useEffect(() => {
    const dateString = new Date().toISOString().substring(0, 10);
    get(`/api/game/today/${branchId}/${dateString}`, (data) => {
      setGames(data.games);
      setPersons(data.persons);
    });
  }, [branchId]);

  if (games === undefined || games.length === 0) {
    return <Menu />;
  }

  if (isLarge) {
    return (
      <>
        <Menu />
        <GameList games={games} persons={persons} today />
      </>
    );
  }

  return (
    <GameList games={games} persons={persons} today>
      <Menu />
    </GameList>
  );
}
