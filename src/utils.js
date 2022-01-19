const get = (url, callback) => {
  fetch(url)
    .then((response) => response.json())
    .then(callback);
};

const post = (url, body, callback) => {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
};

const put = (url, body, callback) => {
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
};

const fetchDelete = (url, body, callback) => {
  fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
};

export { get, post, put, fetchDelete };
