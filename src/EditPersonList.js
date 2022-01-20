import { useEffect, useMemo, useState } from 'react';

import LinkButton from './LinkButton';
import { get, groupByPersonType } from './utils';
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
      <div className="header">명부편집</div>
      <LinkButton to="/add-person">선수등록</LinkButton>
      <div className={style.grid}>
        {sections.map(({ code, persons }) => (
          <div key={code}>
            {persons.map(({ firstName, id }) => (
              <LinkButton key={id} to={`/edit/person/${id}`}>
                {firstName}
              </LinkButton>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
