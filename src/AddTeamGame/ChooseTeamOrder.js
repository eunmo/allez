import { Fragment, useCallback } from 'react';

import { gameOrder } from '../utils';
import style from './index.module.css';

export default function ChooseTeamOrder({
  size,
  side,
  list,
  order,
  setOrder,
  idMap,
  nextValue,
  onDone,
}) {
  const updateOrder = useCallback(
    (id, index) => {
      setOrder((array) => {
        const newArray = [...array];
        newArray[index] = id;
        return newArray;
      });
    },
    [setOrder]
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onDone(event);
    },
    [onDone]
  );

  const done = order.every((id) => id !== null);

  return (
    <form className={style.ChooseTeamOrder}>
      <div className={style.gameOrderLabel}>순서</div>
      <div className={style.gameOrder}>
        {gameOrder[size][side].map((n, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div key={index}>{n}</div>
        ))}
      </div>
      {[...new Array(size).keys()].map((row) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <Fragment key={row}>
          <div className={style.label}>선수 {size * side + row + 1}</div>
          {list.map((id, col) => (
            <input
              /* eslint-disable-next-line react/no-array-index-key */
              key={`${id}-${row}-${col}`}
              type="button"
              value={idMap.get(id)?.firstName ?? '선택'}
              className={order[row] === id ? style.selected : ''}
              onClick={() => updateOrder(id, row)}
            />
          ))}
        </Fragment>
      ))}
      <input
        type="submit"
        value={nextValue}
        disabled={!done}
        onClick={onSubmit}
      />
    </form>
  );
}
