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
  if (persons === null) {
    return [];
  }

  const codeSet = new Set(persons.map(({ type }) => type));
  const codes = [...codeSet].sort();

  function getGroup(code) {
    return persons.filter(({ type }) => type === code).sort(personCmp);
  }

  return codes.map((code) => ({ code, persons: getGroup(code) }));
}

function toPersonIdMap(persons) {
  return new Map(persons.map((person) => [person.id, person]));
}

export {
  get,
  post,
  put,
  fetchDelete,
  displayPersonType,
  groupByPersonType,
  toPersonIdMap,
};
