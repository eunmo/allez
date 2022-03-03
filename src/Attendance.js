import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LinkButton } from './components';
import { displayFullPersonType, get, groupByPersonType, put } from './utils';
import style from './Attendance.module.css';

function Plus() {
  return (
    <svg viewBox="0 0 40 40">
      <rect x="12" y="19" width="16" height="2" className={style.svg} />
      <rect x="19" y="12" width="2" height="16" className={style.svg} />
    </svg>
  );
}

function Minus() {
  return (
    <svg viewBox="0 0 40 40">
      <rect x="12" y="19" width="16" height="2" className={style.svg} />
    </svg>
  );
}

export default function Attendance() {
  const [data, setData] = useState(null);
  const [came, setCame] = useState(new Set());
  const [closed, setClosed] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    get('/api/person/list', (res) => {
      setCame(new Set(res.filter(({ today }) => today).map(({ id }) => id)));
      setData(res);

      const toClose = new Set(['b', 'g', 'h']);
      res.forEach(({ type, today }) => {
        if (today && toClose.has(type)) {
          toClose.delete(type);
        }
      });
      setClosed(toClose);
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

  const toggleOpen = useCallback(
    (code) => {
      const newSet = new Set(closed);
      if (closed.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      setClosed(newSet);
    },
    [closed]
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
        {sections.map(({ code, persons }) => {
          const isClosed = closed.has(code);
          const icon = isClosed ? <Plus /> : <Minus />;

          return (
            <Fragment key={code}>
              <button type="button" onClick={() => toggleOpen(code)}>
                <div>{icon}</div>
                <div>{displayFullPersonType(code)}</div>
              </button>
              {!isClosed &&
                persons.map(({ firstName, id }) => (
                  <input
                    type="button"
                    key={id}
                    value={firstName}
                    className={came.has(id) ? style.came : undefined}
                    onClick={() => toggle(id)}
                  />
                ))}
            </Fragment>
          );
        })}
        <input type="submit" value="제출" />
      </form>
    </div>
  );
}
