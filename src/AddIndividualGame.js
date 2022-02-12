import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { IndividualGameForm } from './components';
import { post } from './utils';

export default function AddIndividualGame() {
  const navigate = useNavigate();

  const submit = useCallback(
    (game) => {
      post('/api/crud/game', { game }, () => {
        navigate('/');
      });
    },
    [navigate]
  );

  return <IndividualGameForm title="개인전 기록" submit={submit} />;
}
