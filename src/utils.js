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

function postGetJson(url, body, callback) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then(callback);
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

const personType = {
  a: { full: '코치', simple: '코치' },
  b: { full: '사라진 코치', simple: '코치', hide: true },
  c: { full: '정규반 남자', simple: '남자' },
  d: { full: '정규반 여자', simple: '여자' },
  e: { full: '입문반 남자', simple: '남자' },
  f: { full: '입문반 여자', simple: '여자' },
  g: { full: '사라진 남자', simple: '남자', hide: true },
  h: { full: '사라진 여자', simple: '여자', hide: true },
};

function displayFullPersonType(type) {
  return personType[type]?.full ?? '모름';
}

function displayPersonType(type) {
  return personType[type]?.simple ?? '모름';
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

function groupByPersonTypeName(persons) {
  const nameSet = new Set(
    (persons ?? []).map(({ type }) => displayPersonType(type))
  );
  const names = [...nameSet].sort().reverse();

  function getGroup(name) {
    return persons
      .filter(({ type }) => displayPersonType(type) === name)
      .sort(personCmp);
  }

  return names.map((name) => ({ name, persons: getGroup(name) }));
}

function toPersonIdMap(persons) {
  return new Map((persons ?? []).map((person) => [person.id, person]));
}

const gameOrder = [
  null,
  null,
  [
    [1, 2, 1, 2],
    [4, 3, 3, 4],
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
    return { l: ls[left - 1], r: rs[right - type - 1] };
  });
}

function parseValue(value) {
  return parseInt(value ?? '0', 10);
}

function parseRounds(rounds) {
  return rounds.map(({ l, r, lp, rp }) => ({
    l,
    r,
    lp: parseValue(lp),
    rp: parseValue(rp),
  }));
}

function sortByName(p1, p2) {
  return p1.firstName < p2.firstName ? -1 : 1;
}

function ignoreType(type) {
  return type === 'a' || type === 'b';
}

export {
  get,
  post,
  postGetJson,
  put,
  fetchDelete,
  personType,
  displayFullPersonType,
  displayPersonType,
  groupByPersonType,
  groupByPersonTypeName,
  toPersonIdMap,
  gameOrder,
  buildRounds,
  parseValue,
  parseRounds,
  sortByName,
  ignoreType,
};
