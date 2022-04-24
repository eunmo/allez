import { useCallback, useEffect, useState } from 'react';

import {
  displayFullPersonType,
  personType,
  branchToId,
  branchNames,
} from '../utils';
import style from './PersonForm.module.css';

export default function PersonForm({ data, onSubmit, title }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [branch, setBranch] = useState(0);
  const [type, setType] = useState(2);

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
      onSubmit({ firstName, lastName, branch, type });
    },
    [firstName, lastName, onSubmit, branch, type]
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
        <label>지점</label>
        <div className={style.buttonGroup}>
          {Object.values(branchToId).map((br) => (
            <input
              type="button"
              key={br}
              value={branchNames[br]}
              onClick={() => setBranch(br)}
              disabled={br === branch}
            />
          ))}
        </div>
        <label>분류</label>
        <div className={style.buttonGroup}>
          {Object.keys(personType).map((typeCode) => (
            <input
              type="button"
              key={typeCode}
              value={displayFullPersonType(typeCode)}
              onClick={() => setType(typeCode)}
              disabled={typeCode === `${type}`}
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
