import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LinkButton } from './components';
import { useBranch } from './BranchContext';
import {
  displayFullPersonType,
  get,
  groupByBranch,
  personType,
  put,
  branchToId,
  branchNames,
} from './utils';
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
  const [branchClosed, setBranchClosed] = useState(new Set());
  const [sectionClosed, setSectionClosed] = useState(new Set());
  const navigate = useNavigate();
  const { branch, branchId } = useBranch();

  useEffect(() => {
    get('/api/person/list', (res) => {
      setCame(
        new Set(
          res.filter(({ today }) => today === branchId).map(({ id }) => id)
        )
      );
      setData(res);

      const branchIds = Object.values(branchToId);
      const branchesToClose = new Set(branchIds);
      branchesToClose.delete(branchId);

      const sectionsToClose = new Set(
        Object.entries(personType)
          .filter(({ 1: { hide } }) => hide)
          .map(([code]) => code)
      );
      const targetSections = [...sectionsToClose];
      const fullSectionsToClose = new Set(
        branchIds.flatMap((i) => targetSections.map((code) => `${i}_${code}`))
      );
      res.forEach(({ branch: br, type, today }) => {
        const code = `${br}_${type}`;
        if (today === branchId && branchesToClose.has(br)) {
          branchesToClose.delete(br);
        }
        if (today === branchId && fullSectionsToClose.has(code)) {
          fullSectionsToClose.delete(code);
        }
      });
      setBranchClosed(branchesToClose);
      setSectionClosed(fullSectionsToClose);
    });
  }, [branchId]);

  const branches = useMemo(
    () => groupByBranch(data, branchId),
    [data, branchId]
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

  const updateAttendance = useCallback(
    (event) => {
      event.preventDefault();
      put('/api/crud/attendance', { ids: [...came], branch: branchId }, () => {
        navigate(`/${branch}`);
      });
    },
    [came, navigate, branch, branchId]
  );

  const toggleBranchOpen = useCallback(
    (code) => {
      const newSet = new Set(branchClosed);
      if (branchClosed.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      setBranchClosed(newSet);
    },
    [branchClosed]
  );

  const toggleSectionOpen = useCallback(
    (code) => {
      const newSet = new Set(sectionClosed);
      if (sectionClosed.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      setSectionClosed(newSet);
    },
    [sectionClosed]
  );

  if (data === null) {
    return null; // TODO: spinner
  }

  return (
    <div className={style.Attendance}>
      <div className="header">출석 체크</div>
      <form onSubmit={updateAttendance}>
        <LinkButton to={`/${branch}/person/edit/list`}>명부 편집</LinkButton>
        <input
          type="reset"
          value="초기화"
          disabled={came.size === 0}
          onClick={() => setCame(new Set())}
        />
        {branches.map(({ branch: br, sections }) => {
          const isBranchClosed = branchClosed.has(br);
          const branchIcon = isBranchClosed ? <Plus /> : <Minus />;

          return (
            <Fragment key={br}>
              <button
                type="button"
                onClick={() => toggleBranchOpen(br)}
                className={style.branch}
              >
                <div>{branchIcon}</div>
                <div>{branchNames[br]}</div>
              </button>
              {!isBranchClosed &&
                sections.map(({ code, persons }) => {
                  const key = `${br}_${code}`;
                  const isSectionClosed = sectionClosed.has(key);
                  const sectionIcon = isSectionClosed ? <Plus /> : <Minus />;

                  return (
                    <Fragment key={code}>
                      <button
                        type="button"
                        onClick={() => toggleSectionOpen(key)}
                      >
                        <div>{sectionIcon}</div>
                        <div>{displayFullPersonType(code)}</div>
                      </button>
                      {!isSectionClosed &&
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
            </Fragment>
          );
        })}
        <input type="submit" value="제출" />
      </form>
    </div>
  );
}
