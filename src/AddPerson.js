import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { PersonForm } from './components';
import { useBranch } from './BranchContext';
import { post } from './utils';

export default function AddPerson() {
  const navigate = useNavigate();
  const { branch } = useBranch();

  const addPerson = useCallback(
    (person) => {
      post('/api/crud/person', person, () => {
        navigate(`/${branch}/person`);
      });
    },
    [navigate, branch]
  );

  return <PersonForm onSubmit={addPerson} title="등록" />;
}
