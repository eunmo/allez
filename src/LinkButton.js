import { Link } from 'react-router-dom';
import style from './LinkButton.module.css';

export default function LinkButton({ children, to }) {
  return (
    <Link className={style.LinkButton} to={to}>
      {children}
    </Link>
  );
}
