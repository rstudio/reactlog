// @flow

// Modified from https: //stackoverflow.com/a/13419367/591574
function parseQuery(queryString = window.location.search): Object {
  let query = {};
  let pairs = (queryString[0] === "?"
    ? queryString.substr(1)
    : queryString
  ).split("&");
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i].split("=");
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }
  return query;
}

export { parseQuery };
