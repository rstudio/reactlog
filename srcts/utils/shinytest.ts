let inTestMode =
  new URLSearchParams(window.location.search).get("test") === "1";

const shinytest = "(shinytest)";

export { inTestMode, shinytest };
