import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameForm } from './components';
import { post } from './utils';

export default function AddGame() {
  const navigate = useNavigate();

  const submit = useCallback(
    (game) => {
      post('/api/crud/game', { game }, () => {
        navigate('/');
      });
    },
    [navigate]
  );

  return <GameForm title="경기 기록 추가" submit={submit} />;
}
