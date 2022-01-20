import { Link } from 'react-router-dom';
import style from './LinkButton.module.css';

export default function LinkButton({ children, key, to }) {
  return (
    <Link className={style.LinkButton} key={key} to={to}>
      {children}
    </Link>
  );
}
