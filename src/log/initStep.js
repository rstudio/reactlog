// @flow

// initialize all log entries to have a step value

import _map from "lodash/map";

import type { LogType } from "./logStates";

if (window.__APP_DATA__) {
  window.log = window.__APP_DATA__;
}

_map((window.log: LogType), function(entry, i: number) {
  entry.step = i;
});
