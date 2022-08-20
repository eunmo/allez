import { LinkButton } from './components';
import { branches } from './utils';
import style from './BranchSelect.module.css';

const sortedBranches = branches.sort((a, b) => a.order - b.order);

export default function BranchSelect() {
  return (
    <div className={style.BranchSelect}>
      {sortedBranches.map(({ code, name }) => (
        <LinkButton key={code} to={`/${code}`}>
          {name}
        </LinkButton>
      ))}
    </div>
  );
}
