import { Link } from 'react-router-dom';
import style from './Header.module.css';

export default function Header() {
  return (
    <Link className={style.Header} to="/">
      YFC 서초점 기록실
    </Link>
  );
}
