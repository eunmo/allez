import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GameForm from './GameForm';
import { fetchDelete, get, put } from './utils';

export default function AddGame() {
  const [game, setGame] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/id/${id}`, setGame);
  }, [id]);

  const submit = useCallback(
    (data) => {
      put('/api/crud/game', { id, game: data }, () => {
        navigate('/');
      });
    },
    [navigate, id]
  );

  const deleteCallback = useCallback(() => {
    fetchDelete('/api/crud/game', { id }, () => {
      navigate('/');
    });
  }, [navigate, id]);

  if (game === undefined) {
    return null; // TODO: spinner
  }

  const [{ l, r, lp, rp }] = game.rounds;

  return (
    <GameForm
      title="경기 기록 수정"
      l={l}
      r={r}
      lp={lp}
      rp={rp}
      submit={submit}
      deleteCallback={deleteCallback}
      editMode
    />
  );
}
