import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { IndividualGameForm } from './components';
import { useBranch } from './BranchContext';
import { post } from './utils';

export default function AddIndividualGame() {
  const navigate = useNavigate();
  const { branch, branchId } = useBranch();

  const submit = useCallback(
    (game) => {
      post('/api/crud/game', { game, branch: branchId }, () => {
        navigate(`/${branch}`);
      });
    },
    [navigate, branch, branchId]
  );

  return <IndividualGameForm title="개인전 기록" submit={submit} />;
}
