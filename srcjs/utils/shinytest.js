// @flow

const queryParams = new URLSearchParams(window.location.search);

let inTestMode = queryParams.get("test") === "1";

const shinytest = "(shinytest)";

export { inTestMode, shinytest };
