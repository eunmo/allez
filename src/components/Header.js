import { Link } from 'react-router-dom';

import { useBranch } from '../BranchContext';
import { Calendar, Home, Podium, Swap } from '../svg';
import { branchNames } from '../utils';
import style from './Header.module.css';

export default function Header() {
  const { branch, branchId } = useBranch();

  return (
    <div className={style.Header}>
      <div className={style.content}>
        <div />
        <div>
          {`YFC 기록실: `}
          {branchNames[branchId]}
          <Link className={style.swapButton} to={`/${branch}/branch`}>
            <Swap />
          </Link>
        </div>
        <div className={style.buttonGroup}>
          <Link className={style.button} to={`/${branch}`}>
            <Home />
          </Link>
          <Link className={style.button} to={`/${branch}/person/rank`}>
            <Podium />
          </Link>
          <Link className={style.button} to={`/${branch}/game/calendar`}>
            <Calendar />
          </Link>
        </div>
      </div>
    </div>
  );
}
