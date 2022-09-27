import { useCallback, useEffect, useState } from 'react';

import style from './AssignPools.module.css';

function randomAssign(ids) {
  const poolCount = Math.ceil(ids.length / 7);
  const pools = new Array(poolCount);

  for (let i = 0; i < poolCount; i += 1) {
    pools[i] = { index: i, participants: [] };
  }

  const remaining = [...ids];
  let poolIndex = 0;
  while (remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    pools[poolIndex].participants.push(remaining[randomIndex]);
    remaining.splice(randomIndex, 1);
    poolIndex = (poolIndex + 1) % poolCount;
  }

  return pools;
}

function copyPools(pools) {
  return pools.map(({ index, participants }) => ({
    index,
    participants: [...participants],
  }));
}

export default function AssignPools({
  ids,
  pools,
  setPools,
  idMap,
  nextValue,
  onDone,
}) {
  const [selected, setSelected] = useState();

  useEffect(() => {
    setPools(randomAssign(ids));
  }, [ids, setPools]);

  const shuffle = useCallback(() => {
    setPools(randomAssign(ids));
  }, [ids, setPools]);

  const select = useCallback(
    (poolIndex, id) => {
      if (selected !== undefined) {
        if (selected.poolIndex !== poolIndex || selected.id !== id) {
          const pool1 = pools[selected.poolIndex];
          const pool2 = pools[poolIndex];

          const index1 = pool1.participants.indexOf(selected.id);
          const index2 = pool2.participants.indexOf(id);

          const newPools = copyPools(pools);
          newPools[selected.poolIndex].participants[index1] = id;
          newPools[poolIndex].participants[index2] = selected.id;
          setPools(newPools);
        }

        setSelected();
      } else {
        setSelected({ poolIndex, id });
      }
    },
    [selected, pools, setPools]
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onDone(event);
    },
    [onDone]
  );

  return (
    <div>
      <p>
        뿔을 변경하려면, 변경하려는 두 명의 이름을 순서대로 누르던가, 재배정
        버튼을 눌러주세요.
      </p>
      <form
        className={style.AssignPools}
        style={{ gridTemplateColumns: `repeat(${pools.length}, 1fr)` }}
      >
        {pools.map(({ index, participants }) => (
          <div className={style.pool} key={index}>
            <label className={style.label}>{`뿔 ${index + 1}`}</label>
            {participants.map((id) => (
              <input
                type="button"
                key={id}
                className={
                  selected?.poolIndex === index && selected?.id === id
                    ? style.selected
                    : ''
                }
                value={idMap.get(id).firstName}
                onClick={() => select(index, id)}
              />
            ))}
          </div>
        ))}
        <input
          style={{ gridColumn: `span ${pools.length}` }}
          className={style.shuffle}
          type="button"
          value="랜덤 재배정"
          onClick={shuffle}
        />
        <input
          style={{ gridColumn: `span ${pools.length}` }}
          type="submit"
          value={nextValue}
          onClick={onSubmit}
        />
      </form>
    </div>
  );
}
