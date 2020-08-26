// @flow

import { parseQuery } from "./queryString";

let inTestMode = parseQuery().test === "1";

const shinytest = "(shinytest)";

export { inTestMode, shinytest };
