// @flow

// initialize all log entries to have a step value

import _map from "lodash/map";

import type { LogType } from "./logStates";


let initLogSteps = function(log: LogType): LogType {
  _map(log, function(entry, i: number) {
    entry.step = i;
  });
  return log;
};

// if (window.__APP_DATA__) {
//   window.log = window.__APP_DATA__;
// }
// initLogSteps((window.log: LogType))

export {initLogSteps};
