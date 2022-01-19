import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './AddPerson.module.css';
import { post } from './utils';

function displayType(type) {
  return { m: '남성', f: '여성', c: '코치' }[type] ?? '모름';
}

export default function AddPerson() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [type, setType] = useState('m');
  const navigate = useNavigate();

  const addPerson = useCallback(() => {
    post('/api/crud/person', { firstName, lastName, type }, () => {
      navigate('/'); // TODO: link to 출석부
    });
  }, [firstName, lastName, navigate, type]);

  return (
    <div className={style.AddPerson}>
      <div>선수등록</div>
      <form onSubmit={addPerson}>
        <div>
          <label>성</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>분류</label>
          {['m', 'f', 'c'].map((typeCode) => (
            <input
              type="button"
              key={typeCode}
              value={displayType(typeCode)}
              onClick={() => setType(typeCode)}
              style={typeCode === type ? { backgroundColor: 'red' } : {}}
            />
          ))}
        </div>
        <div>
          <input type="submit" value="등록" />
        </div>
      </form>
    </div>
  );
}
