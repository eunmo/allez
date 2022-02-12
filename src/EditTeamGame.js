import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchDelete, get, put } from './utils';

export default function EditTeamGame() {
  const [game, setGame] = useState();
  const [rounds, setRounds] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    get(`/api/game/id/${id}`, (data) => {
      const baseRounds = setGame(data);
    });
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

  return (
    <div>
      <div className="header">단체전 진행</div>
      <form>
        <input type="button" value="삭제" onClick={deleteCallback} />
      </form>
    </div>
  );
}
