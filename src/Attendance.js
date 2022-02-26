import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LinkButton } from './components';
import { displayFullPersonType, get, groupByPersonType, put } from './utils';
import style from './Attendance.module.css';

export default function Attendance() {
  const [data, setData] = useState(null);
  const [came, setCame] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    get('/api/person/list', (res) => {
      setCame(new Set(res.filter(({ today }) => today).map(({ id }) => id)));
      setData(res);
    });
  }, []);

  const sections = useMemo(() => groupByPersonType(data), [data]);

  const toggle = useCallback(
    (id) => {
      const newSet = new Set(came);
      if (came.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setCame(newSet);
    },
    [came]
  );

  const updateAttendance = useCallback(
    (event) => {
      event.preventDefault();
      put('/api/crud/attendance', { ids: [...came] }, () => {
        navigate('/');
      });
    },
    [came, navigate]
  );

  if (data === null) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.Attendance}>
      <div className="header">출석 체크</div>
      <form onSubmit={updateAttendance}>
        <LinkButton to="/person/edit/list">명부 편집</LinkButton>
        <input
          type="reset"
          value="초기화"
          disabled={came.size === 0}
          onClick={() => setCame(new Set())}
        />
        {sections.map(({ code, persons }) => (
          <Fragment key={code}>
            <label>{displayFullPersonType(code)}</label>
            {persons.map(({ firstName, id }) => (
              <input
                type="button"
                key={id}
                value={firstName}
                className={came.has(id) ? style.came : undefined}
                onClick={() => toggle(id)}
              />
            ))}
          </Fragment>
        ))}
        <input type="submit" value="제출" />
      </form>
    </div>
  );
}
