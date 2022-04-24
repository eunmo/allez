import { Fragment, useEffect, useMemo, useState } from 'react';

import { LinkButton } from './components';
import { useBranch } from './BranchContext';
import {
  displayFullPersonType,
  get,
  groupByBranch,
  branchNames,
} from './utils';
import style from './EditPersonList.module.css';

export default function EditPersonList() {
  const [data, setData] = useState(null);
  const { branch, branchId } = useBranch();

  useEffect(() => {
    get('/api/person/list', setData);
  }, []);

  const branches = useMemo(() => groupByBranch(data, branchId), [data, branchId]);

  if (data === null) {
    return null; // TODO: spinner;
  }

  return (
    <div className={style.EditPersonList}>
      <div className="header">명부 편집</div>
      <LinkButton to={`/${branch}/person/add`}>선수 등록</LinkButton>
      <div className={style.grid}>
        {branches.map(({ branch: br, sections }) => (
          <Fragment key={br}>
            <div className={style.branchLabel}>{branchNames[br]}</div>
            {sections.map(({ code, persons }) => (
              <Fragment key={code}>
                <div className={style.sectionLabel}>
                  {displayFullPersonType(code)}
                </div>
                {persons.map(({ firstName, id }) => (
                  <LinkButton key={id} to={`/${branch}/person/edit/${id}`}>
                    {firstName}
                  </LinkButton>
                ))}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
