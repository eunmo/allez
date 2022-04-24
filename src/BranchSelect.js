import { LinkButton } from './components';
import { branches } from './utils';
import style from './BranchSelect.module.css';

export default function BranchSelect() {
  return (
    <div className={style.BranchSelect}>
      {branches.map(({ code, name }) => (
        <LinkButton key={code} to={`/${code}`}>
          {name}
        </LinkButton>
      ))}
    </div>
  );
}
