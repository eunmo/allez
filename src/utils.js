function get(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then(callback);
}

function post(url, body, callback) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
}

function put(url, body, callback) {
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
}

function fetchDelete(url, body, callback) {
  fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
}

function displayPersonType(type) {
  return { m: '남성', f: '여성', c: '코치' }[type] ?? '모름';
}

function personCmp(a, b) {
  return a.firstName < b.firstName ? -1 : 1;
}

function groupByPersonType(persons) {
  const codeSet = new Set((persons ?? []).map(({ type }) => type));
  const codes = [...codeSet].sort();

  function getGroup(code) {
    return persons.filter(({ type }) => type === code).sort(personCmp);
  }

  return codes.map((code) => ({ code, persons: getGroup(code) }));
}

function toPersonIdMap(persons) {
  return new Map((persons ?? []).map((person) => [person.id, person]));
}

const gameOrder = [
  null,
  null,
  [
    [2, 1, 1, 2],
    [3, 4, 3, 4],
  ],
  [
    [3, 1, 2, 1, 3, 2, 1, 2, 3],
    [6, 5, 4, 6, 4, 5, 4, 6, 5],
  ],
  [
    [4, 1, 2, 3, 2, 1, 3, 4, 1, 2, 3, 4],
    [8, 7, 5, 6, 7, 8, 5, 6, 5, 6, 8, 7],
  ],
];

function buildRounds(type, ls, rs) {
  return gameOrder[type][0].map((left, index) => {
    const right = gameOrder[type][1][index];
    return { l: ls[left - 1], r: rs[right - type - 1], lp: 0, rp: 0 };
  });
}

function parseValue(value) {
  return parseInt(value ?? '0', 10);
}

export {
  get,
  post,
  put,
  fetchDelete,
  displayPersonType,
  groupByPersonType,
  toPersonIdMap,
  gameOrder,
  buildRounds,
  parseValue,
};
