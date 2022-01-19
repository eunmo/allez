import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Attendance.module.css';
import { get, put } from './utils';

function cmpFn(a, b) {
  return a.firstName < b.firstName ? -1 : 1;
}

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

  const sections = useMemo(
    () =>
      ['c', 'f', 'm'].map((code) => ({
        code,
        persons: (data ?? []).filter(({ type }) => type === code).sort(cmpFn),
      })),
    [data]
  );

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

  const updateAttendance = useCallback(() => {
    put('/api/crud/attendance', { ids: [...came] }, () => {
      navigate('/');
    });
  }, [came, navigate]);

  if (data === null) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.Attendance}>
      <div className="header">출석체크</div>
      <form onSubmit={updateAttendance}>
        {sections.map(({ code, persons }) => (
          <div key={code}>
            {persons.map(({ firstName, id }) => (
              <input
                type="button"
                key={id}
                value={firstName}
                className={came.has(id) ? style.came : undefined}
                onClick={() => toggle(id)}
              />
            ))}
          </div>
        ))}
        <input
          type="reset"
          value="초기화"
          disabled={came.size === 0}
          onClick={() => setCame(new Set())}
        />
        <input type="submit" value="제출" />
      </form>
    </div>
  );
}
