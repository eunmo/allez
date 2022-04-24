import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IndividualGameForm } from './components';
import { useBranch } from './BranchContext';
import { fetchDelete, get, put } from './utils';

export default function EditIndividualGame() {
  const [game, setGame] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const { branch } = useBranch();

  useEffect(() => {
    get(`/api/game/id/${id}`, setGame);
  }, [id]);

  const submit = useCallback(
    (data) => {
      const { branch: br } = game;
      put('/api/crud/game', { id, game: data, branch: br }, () => {
        navigate(`/${branch}`);
      });
    },
    [navigate, id, branch, game]
  );

  const deleteCallback = useCallback(() => {
    fetchDelete('/api/crud/game', { id }, () => {
      navigate(`/${branch}`);
    });
  }, [navigate, id, branch]);

  if (game === undefined) {
    return null; // TODO: spinner
  }

  const [{ l, r, lp, rp }] = game.rounds;
  const todayDate = new Date().toISOString().substring(0, 10);
  const gameDate = game.time.substring(0, 10);
  const today = todayDate === gameDate;

  return (
    <IndividualGameForm
      title="경기 기록 수정"
      l={l}
      r={r}
      lp={lp}
      rp={rp}
      submit={submit}
      deleteCallback={deleteCallback}
      editMode
      today={today}
    />
  );
}
