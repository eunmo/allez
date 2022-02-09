import { Link } from 'react-router-dom';
import style from './LinkButton.module.css';

export default function LinkButton({
  children,
  size = 'md',
  style: givenStyle,
  to,
}) {
  return (
    <Link
      className={`${style.LinkButton} ${style[size]}`}
      style={givenStyle}
      to={to}
    >
      {children}
    </Link>
  );
}
