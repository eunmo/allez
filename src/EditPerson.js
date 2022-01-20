import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PersonForm from './PersonForm';
import { get, put } from './utils';

export default function EditPerson() {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    get(`/api/person/id/${id}`, setData);
  }, [id]);

  const editPerson = useCallback(
    (person) => {
      put('/api/crud/person', { ...person, id }, () => {
        navigate('/person/attendance');
      });
    },
    [id, navigate]
  );

  return <PersonForm data={data} onSubmit={editPerson} title="편집" />;
}
