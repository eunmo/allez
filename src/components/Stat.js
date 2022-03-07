import style from './Stat.module.css';

export default function Stat({ value, pad = 3 }) {
  return (
    <div className={`${value < 0 ? style.negative : ''} mono`}>
      {`${value}`.padStart(pad, '\xa0')}
    </div>
  );
}
