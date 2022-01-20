import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { displayPersonType, get, put } from './utils';
import style from './AddPerson.module.css';

export default function EditPerson() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [type, setType] = useState('m');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    get(`/api/person/id/${id}`, (data) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setType(data.type);
    });
  }, [id]);

  const editPerson = useCallback(() => {
    put('/api/crud/person', { firstName, lastName, id, type }, () => {
      navigate('/person/attendance');
    });
  }, [firstName, lastName, id, navigate, type]);

  return (
    <div className={style.AddPerson}>
      <div className="header">선수편집</div>
      <form onSubmit={editPerson}>
        <label>성</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label>이름</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label>분류</label>
        <div className={style.buttonGroup}>
          {['m', 'f', 'c'].map((typeCode) => (
            <input
              type="button"
              key={typeCode}
              value={displayPersonType(typeCode)}
              onClick={() => setType(typeCode)}
              disabled={typeCode === type}
            />
          ))}
        </div>
        <input
          type="submit"
          value="편집"
          disabled={firstName === '' || lastName === ''}
        />
      </form>
    </div>
  );
}
