import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PersonForm } from './components';
import { useBranch } from './BranchContext';
import { get, put } from './utils';

export default function EditPerson() {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const { branch } = useBranch();

  useEffect(() => {
    get(`/api/person/id/${id}`, setData);
  }, [id]);

  const editPerson = useCallback(
    (person) => {
      put('/api/crud/person', { ...person, id }, () => {
        navigate(`/${branch}/person`);
      });
    },
    [id, navigate, branch]
  );

  return <PersonForm data={data} onSubmit={editPerson} title="편집" />;
}
