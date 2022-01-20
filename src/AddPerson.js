import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonForm from './PersonForm';
import { post } from './utils';

export default function AddPerson() {
  const navigate = useNavigate();

  const addPerson = useCallback(
    (person) => {
      post('/api/crud/person', person, () => {
        navigate('/person');
      });
    },
    [navigate]
  );

  return <PersonForm onSubmit={addPerson} title="등록" />;
}
