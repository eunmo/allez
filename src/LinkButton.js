import { Link } from 'react-router-dom';
import style from './LinkButton.module.css';

export default function LinkButton({ children, mb: marginBottom = '8px', to }) {
  return (
    <Link className={style.LinkButton} style={{ marginBottom }} to={to}>
      {children}
    </Link>
  );
}
