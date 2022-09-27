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
  0: { full: '코치', simple: '코치', order: 1 },
  1: { full: '사라진 코치', simple: '코치', hide: true, order: 12 },
  2: { full: '정규반 남자', simple: '남자', order: 2 },
  3: { full: '정규반 여자', simple: '여자', order: 3 },
  4: { full: '입문반 남자', simple: '남자', order: 4 },
  5: { full: '입문반 여자', simple: '여자', order: 5 },
  6: { full: '사라진 남자', simple: '남자', hide: true, order: 13 },
  7: { full: '사라진 여자', simple: '여자', hide: true, order: 14 },
  8: { full: '고등부 남자', simple: '남자', order: 6 },
  9: { full: '고등부 여자', simple: '여자', order: 7 },
  10: { full: '중등부 남자', simple: '남자', order: 8 },
  11: { full: '중등부 여자', simple: '여자', order: 9 },
  12: { full: '초등부 남자', simple: '남자', order: 10 },
  13: { full: '초등부 여자', simple: '여자', order: 11 },
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

function typeCmp(a, b) {
  return personType[a].order - personType[b].order;
}

function groupByPersonType(persons) {
  const codeSet = new Set((persons ?? []).map(({ type }) => type));
  const codes = [...codeSet].sort(typeCmp);

  function getGroup(code) {
    return persons.filter(({ type }) => type === code).sort(personCmp);
  }

  return codes.map((code) => ({ code, persons: getGroup(code) }));
}

function groupByBranch(persons, currentBranch) {
  const branchSet = new Set((persons ?? []).map(({ branch }) => branch));
  function branchCmp(a, b) {
    if (a === currentBranch) {
      return -1;
    }
    if (b === currentBranch) {
      return 1;
    }
    return a - b;
  }
  const branches = [...branchSet].sort(branchCmp);

  return branches.map((branch) => ({
    branch,
    sections: groupByPersonType(
      persons.filter(({ branch: b }) => b === branch)
    ),
  }));
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

const poolOrder = [
  null,
  null,
  null,
  null,
  [
    // 4명 14 23 13 24 34 12
    [1, 2, 1, 2, 3, 1],
    [4, 3, 3, 4, 4, 2],
  ],
  [
    // 5명 12 34 51 23 45 13 25 14 35 24
    [1, 3, 1, 2, 4, 1, 2, 1, 3, 2],
    [2, 4, 5, 3, 5, 3, 5, 4, 5, 4],
  ],
  [
    // 6명 12 34 56 13 26 45 16 35 24 15 46 23 14 25 36
    [1, 3, 5, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 2, 3],
    [2, 4, 6, 3, 6, 5, 6, 5, 4, 5, 6, 3, 4, 5, 6],
  ],
  [
    // 7명 14 25 36 17 45 23 67 15 34 26 57 13 46 27 35 16 24 37 56 12 47
    [1, 2, 3, 1, 4, 2, 6, 1, 3, 2, 5, 1, 4, 2, 3, 1, 2, 3, 5, 1, 4],
    [4, 5, 6, 7, 5, 3, 7, 5, 4, 6, 7, 3, 6, 7, 5, 6, 4, 7, 6, 2, 7],
  ],
];

function buildPoolRounds(ids) {
  const size = ids.length;
  return poolOrder[size][0].map((left, index) => {
    const right = poolOrder[size][1][index];
    return { l: ids[left - 1], r: ids[right - 1] };
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
  return [0, 1].includes(type);
}

function formatDate(date) {
  const m = parseInt(date.substring(5, 7), 10);
  const d = parseInt(date.substring(8, 10), 10);

  return `${m}월 ${d}일`;
}

const branches = [
  { code: 'seocho', index: 0, name: '서초 성인반', order: 1 },
  { code: 'daechi', index: 1, name: '대치 성인반', order: 3 },
  { code: 'cheonan', index: 2, name: '천안 성인반', order: 5 },
  { code: 'hanam', index: 3, name: '하남 성인반', order: 7 },
  { code: 'seocho-kids', index: 4, name: '서초 학생반', order: 2 },
  { code: 'daechi-kids', index: 5, name: '대치 학생반', order: 4 },
  { code: 'cheonan-kids', index: 6, name: '천안 학생반', order: 6 },
  { code: 'hanam-kids', index: 7, name: '하남 학생반', order: 8 },
];

const branchCodes = branches.map(({ code }) => code);
const branchToId = Object.fromEntries(
  branches.map(({ code, index }) => [code, index])
);
const branchNames = branches.map(({ name }) => name);

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
  groupByBranch,
  groupByPersonTypeName,
  toPersonIdMap,
  gameOrder,
  buildRounds,
  buildPoolRounds,
  parseValue,
  parseRounds,
  sortByName,
  ignoreType,
  formatDate,
  branches,
  branchCodes,
  branchToId,
  branchNames,
};
