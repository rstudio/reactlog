// initialize all log entries to have a step value

import _map from "lodash/map";

import type { LogType } from "./logStates";

function initStep(log: LogType): LogType {
  _map(log, function (entry, i: number) {
    entry.step = i;
  });
  return log;
}

if (window.__APP_DATA__) {
  window.log = window.__APP_DATA__;
}

initStep(window.log);

export { initStep };
