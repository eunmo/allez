import { Link } from 'react-router-dom';

import style from './LinkButton.module.css';

export default function LinkButton({
  children,
  size = 'md',
  style: givenStyle,
  cn = '',
  to,
}) {
  return (
    <Link
      className={`${style.LinkButton} ${style[size]} ${cn}`}
      style={givenStyle}
      to={to}
    >
      {children}
    </Link>
  );
}
