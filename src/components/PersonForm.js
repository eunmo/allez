import { useCallback, useEffect, useState } from 'react';

import { displayFullPersonType, personType } from '../utils';
import style from './PersonForm.module.css';

export default function PersonForm({ data, onSubmit, title }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [type, setType] = useState('m');

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setType(data.type);
    }
  }, [data]);

  const onSubmitCallback = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit({ firstName, lastName, type });
    },
    [firstName, lastName, onSubmit, type]
  );

  return (
    <div className={style.PersonForm}>
      <div className="header">선수 {title}</div>
      <form onSubmit={onSubmitCallback}>
        <label>성</label>
        <input
          type="text"
          className={style.text}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label>이름</label>
        <input
          type="text"
          className={style.text}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label>분류</label>
        <div className={style.buttonGroup}>
          {Object.keys(personType).map((typeCode) => (
            <input
              type="button"
              key={typeCode}
              value={displayFullPersonType(typeCode)}
              onClick={() => setType(typeCode)}
              disabled={typeCode === type}
            />
          ))}
        </div>
        <input
          type="submit"
          value={title}
          disabled={firstName === '' || lastName === ''}
        />
      </form>
    </div>
  );
}
