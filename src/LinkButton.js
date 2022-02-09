import { Link } from 'react-router-dom';
import style from './LinkButton.module.css';

export default function LinkButton({ children, size = 'md', to }) {
  return (
    <Link className={`${style.LinkButton} ${style[size]}`} to={to}>
      {children}
    </Link>
  );
}
