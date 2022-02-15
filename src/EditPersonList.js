import { useEffect, useMemo, useState } from 'react';

import { LinkButton } from './components';
import { displayPersonType, get, groupByPersonType } from './utils';
import style from './EditPersonList.module.css';

export default function EditPersonList() {
  const [data, setData] = useState(null);

  useEffect(() => {
    get('/api/person/list', setData);
  }, []);

  const sections = useMemo(() => groupByPersonType(data), [data]);

  if (data === null) {
    return null; // TODO: spinner;
  }

  return (
    <div className={style.EditPersonList}>
      <div className="header">명부 편집</div>
      <LinkButton to="/person/add">선수 등록</LinkButton>
      <div className={style.grid}>
        {sections.map(({ code, persons }) => (
          <div key={code}>
            <div className={style.label}>{displayPersonType(code)}</div>
            {persons.map(({ firstName, id }) => (
              <LinkButton key={id} to={`/person/edit/${id}`}>
                {firstName}
              </LinkButton>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
