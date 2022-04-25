import { useCallback } from 'react';

import { parseValue } from '../utils';
import style from './PointInput.module.css';

function PointInputValue({ digit, onClick, disabled }) {
  return (
    <input
      type="button"
      value={digit}
      onClick={(e) => onClick(e.target.value)}
      disabled={disabled}
    />
  );
}

export default function PointInput({ value, setValue, onDone = () => {} }) {
  const onClickDigit = useCallback(
    (digit) => {
      setValue(`${parseValue(value) * 10 + parseValue(digit)}`);
      onDone();
    },
    [value, setValue, onDone]
  );

  const backspace = useCallback(() => {
    if (!value) {
      return;
    }

    if (value.length === 1) {
      setValue();
    } else {
      setValue(value.substring(0, value.length - 1));
    }
  }, [value, setValue]);

  return (
    <div className={style.PointInput}>
      <label className={style.label}>점수 입력</label>
      {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((d) => (
        <PointInputValue key={d} digit={d} onClick={onClickDigit} />
      ))}
      <input
        type="button"
        value="C"
        onClick={() => setValue()}
        disabled={!value}
      />
      <PointInputValue digit={0} onClick={onClickDigit} />
      <input type="button" value="⌫" onClick={backspace} disabled={!value} />
    </div>
  );
}
